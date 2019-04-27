const Knex = require('knex')
const { Model } = require('objection')
const { database } = require('../configuration')
const { logger } = require('../utils')

async function connect() {
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
        logger.log({
          level: 'info',
          message: `Connection to Database established successfully...`
        })
        resolve(conn)
      })
      .catch((err) => {
        logger.log({
          level: 'error',
          message: `Failed connect to database, reconnecting... ${JSON.stringify(
            err
          )}`
        })
        setTimeout(() => resolve(openConnection()), database.retryInterval)
      })
  })
}

module.exports = {
  openConnection
}
