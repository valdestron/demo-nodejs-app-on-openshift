const rabbit = require('../interfaces/rabbit')
const { destroyUser } = require('../repository/user')
const { logger, parseMessage, errorHandler, response } = require('../utils')
const COMMUNICATION = require('../models/Communication')

const handler = async (originalMessage) => {
  const msg = parseMessage(originalMessage)

  if (!msg) {
    await errorHandler.notifyErrorUpstream(
      `Malformed message from: ${COMMUNICATION.FIND_ONE_USER.REQUEST_TOPIC}`,
      'MALFORMED_MESSAGE',
      originalMessage
    )
    return
  }

  try {
    await destroyUser(msg.data.id)
  } catch (e) {
    logger.log({ level: 'error', message: `Something wrong happend during the users search, ${e}` })
    return
  }

  try {
    rabbit.publish(COMMUNICATION.DESTROY_USER.RESPONSE_TOPIC, response(), originalMessage.fields.routingKey)
  } catch (e) {
    logger.log({ level: 'error', message: `Can not publish message, ${e}` })
    await errorHandler.notifyErrorUpstream(
      `Failed to publish message, ${COMMUNICATION.DESTROY_USER.REQUEST_TOPIC}`,
      'RABBIT_MQ_ERROR',
      originalMessage,
      e,
      e
    )
    return
  }

  rabbit.ack(originalMessage)

  logger.log({ level: 'error', message: `Message ack.` })
}

const metadata = {
  handler,
  ...COMMUNICATION.DESTROY_USER
}

module.exports = {
  handler,
  metadata
}
