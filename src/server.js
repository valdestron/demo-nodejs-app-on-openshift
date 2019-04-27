require('./utils/env')
const { logger } = require('./utils')
const rabbit = require('./interfaces/rabbit')
const db = require('./interfaces/sql')
const { findAllUsersHandler, findOneUserHandler, insertUserHandler, destroyUserHandler } = require('./handlers')

Promise.all([rabbit.openConnection(), db.openConnection()])
  .then(() => {
    rabbit.registerConsumers([findAllUsersHandler.metadata, findOneUserHandler.metadata, insertUserHandler.metadata, destroyUserHandler.metadata])
    logger.log({
      level: 'info',
      message: 'DevDays User MS Connected to RabbitMQ...'
    })
  })
  .catch((err) => {
    logger.log({ level: 'error', message: `${err.message} - ${err.stack}` })
    process.exit(1)
  })