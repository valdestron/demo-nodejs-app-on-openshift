const rabbit = require('../interfaces/rabbit')
const logger = require('./logger')

const notifyUpstream = (error) => {
  return new Promise((resolve, reject) => {
    try {
      rabbit.publishError(error)
      if (error.details) {
        rabbit.ack(error.details.originalMessage, false)
      }
      resolve()
    } catch (e) {
      logger.log({ level: 'error', message: `Notify Error Upstream Failed. ${e}` })
      reject()
    }
  })
}

const notifyErrorUpstream = async (
  reason,
  reasonCode = 'SERVER_ERROR',
  originalMessage = {},
  originalErrorEvent = {},
  errorEvent = null
) => {
  logger.log({ level: 'error', message: `${reasonCode} - ${reason}. ${originalErrorEvent} ${errorEvent}` })

  let error = {}
  let parsedMessage = {}

  if (originalErrorEvent.message && originalErrorEvent.stack) {
    error = {
      errorMessage: originalErrorEvent.message || errorEvent.message,
      errorStack: originalErrorEvent.stack || errorEvent.stack
    }
  } else if (errorEvent && errorEvent.message && errorEvent.stack) {
    error = {
      errorMessage: errorEvent.message,
      errorStack: errorEvent.stack
    }
  }

  try {
    parsedMessage = JSON.parse(originalMessage.content.toString('utf8'))
  } catch (e) {
    logger.log({ level: 'error', message: `Unable to parse message. ${e}` })
    parsedMessage = null
  }

  error = {
    reasonCode,
    reason,
    details: {
      originalMessage,
      parsedMessage,
      ...error
    }
  }

  return await notifyUpstream(error)
}

const resolveThroughNackAndRequeue = async (originalMessage) => {
  try {
    if (originalMessage.fields.redelivered) {
      rabbit.nack(originalMessage.details.originalMessage, false, true)
    } else {
      await notifyUpstream('This error already redelivered', 'REDELIVERED', originalMessage)
    }
  } catch (e) {
    logger.log({ level: 'error', message: `Resolve through NACK and Requeue failed, ${e}`})
    return
  }
}

module.exports = {
  notifyErrorUpstream,
  resolveThroughNackAndRequeue
}
