const amqp = require('amqplib')
const { rabbit } = require('../configuration')
const { logger } = require('../utils')
const COMMUNICATION = require('../models/Communication')
const COMMUNICATION_VALUES = Object.values(COMMUNICATION);


let rabbitChannel = null

const assertExchange = (exchange, reqQueue) => {
  return rabbitChannel.assertExchange(exchange, 'topic', { durable: true })
    .then(() => {
      return rabbitChannel.assertQueue(reqQueue, { durable: true })
    })
    .then((result) => {
      return rabbitChannel.bindQueue(result.queue, exchange, '#')
    })
}


const openConnection = () => {
  return amqp
    .connect(rabbit.connStr)
    .then((conn) => {
      return conn.createChannel()
    })
    .then((channel) => {
      rabbitChannel = channel
      return Promise.all(COMMUNICATION_VALUES.map(({EXCHANGE, REQUEST}) => assertExchange(EXCHANGE, REQUEST)))
    })
    .catch((err) => {
      logger.log({
        level: 'error',
        message: `Failed connect to RabbitMQ, reconnecting... ${JSON.stringify(err)}`
      })
      return new Promise((resolve) => {
        setTimeout(() => resolve(openConnection()), rabbit.retryInterval)
      })
    })
}


const registerConsumers = (consumers) => {
  return consumers.map(({ REQUEST, handler }) => rabbitChannel.consume(REQUEST, handler))
}

const publish = (exchange, msg, routingKey) => {
  return rabbitChannel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(msg)),
    {
      persistent: true,
      contentType: 'application/json'
    }
  )
}

const publishError = (error) => {
  return publish('ERRORS', error)
}

const ack = (message, allUpTo = false) => {
  rabbitChannel.ack(message, allUpTo)
}

const nack = (message, multiple = false, requeue = false) => {
  rabbitChannel.nack(message, multiple, requeue)
}

module.exports = {
  openConnection,
  publish,
  publishError,
  registerConsumers,
  ack,
  nack
}
