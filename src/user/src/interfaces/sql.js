const Knex = require('knex')
const { Model } = require('objection')
const { database } = require('../configuration')
const logger = require('../utils/logger').get()

/**
 * Connection to database
 * @returns {Promise} Connection promise
 */
async function connect() {
  console.log(database)
  const knex = Knex(database)

  try {
    await knex.select(knex.raw('1'))
    return Promise.resolve(knex)
  } catch (err) {
    return Promise.reject(err)
  }
}

const openConnection = () => {
  return new Promise((resolve) => {
    return connect()
      .then((conn) => {
        Model.knex(conn)
        logger.info(`Connection to Database established successfully...`)
        resolve(conn)
      })
      .catch((err) => {
        logger.error(`Failed connect to database, reconnecting... ${JSON.stringify(err)}`)
        setTimeout(() => resolve(openConnection()), database.retryInterval)
      })
  })
}

module.exports = {
  connect,
  openConnection
}
