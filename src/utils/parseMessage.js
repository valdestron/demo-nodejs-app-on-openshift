const logger = require('./logger')

module.exports = (message) => {
    logger.log({ level: 'info', message: 'Got a message from RabbitMQ' })
  
    try {
      const msg = JSON.parse(message.content.toString('utf8'))
      return msg
    } catch (e) {
      logger.log({ level: 'error', message: `Unable to parse message: ${e}` })
      return null
    }
  
}