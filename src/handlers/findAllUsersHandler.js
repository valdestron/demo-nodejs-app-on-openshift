const rabbit = require('../interfaces/rabbit')
const { getUsers } = require('../repository/user')
const { logger, parseMessage, errorHandler, response } = require('../utils')
const COMMUNICATION = require('../models/Communication')

const handler = async (originalMessage) => {
  const msg = parseMessage(originalMessage);

  if (!msg) {
    await errorHandler.notifyErrorUpstream(
      `Malformed message from: ${COMMUNICATION.FIND_ONE_USER.EXCHANGE}`,
      'MALFORMED_MESSAGE',
      originalMessage
    )
    return
  }

  let users

  try {
    users = await getUsers()
  } catch(e) {
    logger.log({ level: 'error', message: `Something wrong happend during the users search, ${e}` })
    return
  }

  try {
    rabbit.publish(COMMUNICATION.FIND_ALL_USERS.EXCHANGE, response(users), originalMessage.fields.routingKey)
  } catch (e) {
    logger.log({ level: 'error', message: `Can not publish message, ${e}` })
    await errorHandler.notifyErrorUpstream(
      `Failed to publish message, ${COMMUNICATION.FIND_ALL_USERS.EXCHANGE}`,
      'RABBIT_MQ_ERROR',
      originalMessage,
      e,
      e
    )
    return
  }


  rabbit.ack(originalMessage)
}

const metadata = {
  handler,
  ...COMMUNICATION.FIND_ALL_USERS
}

module.exports = {
  handler,
  metadata
}