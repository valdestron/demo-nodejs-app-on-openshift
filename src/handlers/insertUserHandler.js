const uuid = require('uuid/v4')
const rabbit = require('../interfaces/rabbit')
const { insertUser, destroyUser } = require('../repository/user')
const { logger, parseMessage, errorHandler, response } = require('../utils')
const COMMUNICATION = require('../models/Communication')

const rollback = async (originalMessage, id, originalErrorEvent) => {
  logger.log({ level: 'info', message: 'Database rollback initiated.' })

  try {
    await destroyUser(id)
  } catch (e) {
    try {
      await errorHandler.resolveThroughNackAndRequeue(originalMessage)
    } catch (err) {
      errorHandler.notifyErrorUpstream(
        'Failed nack and requeue in rollback',
        'RABBIT_MQ_ERROR',
        originalMessage,
        originalErrorEvent,
        err
      )
    }
  }

  errorHandler.notifyErrorUpstream(
    'Failed database rollback',
    'DATBASE_ERROR',
    originalMessage,
    originalErrorEvent,
  )

  logger.log({ level: 'info', message: 'Database rollback was completed.' })
}

const handler = async (originalMessage) => {
  const msg = parseMessage(originalMessage)

  if (!msg) {
    await errorHandler.notifyErrorUpstream(
      `Malformed message from: ${COMMUNICATION.FIND_ONE_USER.EXCHANGE}`,
      'MALFORMED_MESSAGE',
      originalMessage
    )
    return
  }

  let user

  try {
    user = await insertUser(msg.data)
  } catch (e) {
    logger.log({ level: 'error', message: `Something wrong happend with Database Insertion, ${e}` })
    await errorHandler.resolveThroughNackAndRequeue(originalMessage)
    return
  }

  try {
    rabbit.publish(COMMUNICATION.INSERT_USER.EXCHANGE, response(), originalMessage.fields.routingKey)
  } catch (e) {
    logger.log({ level: 'error', message: `Can not publish message, ${e}` })
    rollback(originalMessage, user.id, e)
    return
  }

  rabbit.ack(originalMessage)
}

const metadata = {
  handler,
  ...COMMUNICATION.INSERT_USER
}

module.exports = {
  handler,
  metadata
}
