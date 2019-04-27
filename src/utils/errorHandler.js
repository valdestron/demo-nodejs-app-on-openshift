const rabbit = require('../interfaces/rabbit')
const logger = require('./logger')
const COMMUNICATION = require('../models/Communication')

const notifyUpstream = (error) => {
  return new Promise((resolve, reject) => {
    try {
      rabbit.publish(COMMUNICATION.ERRORS.EXCHANGE, error)
      if (error.details) {
        rabbit.ack(error.details.originalMessage, false)
      }
      resolve()
      logger.log({ level: 'info', message: `Error was resolved by Notifying Error Upstream.` })
    } catch (e) {
      logger.log({ level: 'error', message: `Notify Error Upstream Failed. Check RabbitMQ Connection. ${e}` })
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
    if (originalMessage.fields && !originalMessage.fields.redelivered) {
      rabbit.nack(originalMessage, false, true)
      logger.log({ level: 'info', message: `Error was resolved through Nack and Requeue.` })
    } else {
      await notifyUpstream({
        reasonCode: 'ALREADY_REDELIVERED',
        reason: 'This error already redelivered, it goes to error queue',
        details: {
          originalMessage
        }
      })
    }
  } catch (e) {
    logger.log({ level: 'error', message: `Resolve through NACK and Requeue failed, Check RabbitMQ Connetion. ${e}` })
  }

  return
}

module.exports = {
  notifyErrorUpstream,
  resolveThroughNackAndRequeue
}
