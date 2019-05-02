const amqp = require('amqplib')
const { rabbit } = require('../configuration')
const { logger } = require('../utils')
const COMMUNICATION = Object.values(require('../models/Communication'))

let rabbitChannel = null

const assertExchange = (exchange, queue) => {
  return rabbitChannel.assertExchange(exchange, 'topic', { durable: true })
    .then(() => {
      return rabbitChannel.assertQueue(queue, { durable: true })
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
      return Promise.all([
        ...COMMUNICATION.map(({ REQUEST_TOPIC, REQUEST_QUEUE }) => assertExchange(REQUEST_TOPIC, REQUEST_QUEUE)),
        ...COMMUNICATION.map(({ RESPONSE_TOPIC, RESPONSE_QUEUE }) => assertExchange(RESPONSE_TOPIC, RESPONSE_QUEUE)),
      ])
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
  return consumers.map(({ REQUEST_QUEUE, handler }) => rabbitChannel.consume(REQUEST_QUEUE, handler))
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

const ack = (message, allUpTo = false) => {
  rabbitChannel.ack(message, allUpTo)
}

const nack = (message, multiple = false, requeue = false) => {
  rabbitChannel.nack(message, multiple, requeue)
}

module.exports = {
  openConnection,
  publish,
  registerConsumers,
  ack,
  nack
}
