if (process.env.NODE_ENV !== 'memory' && process.env.NODE_ENV !== 'test') {
  throw new Error(
    'process.env.NODE_ENV is not one of test environments: in memory or test'
  )
}

before(async () => {
  const { database } = require('../configuration')
  const { connect, openConnection } = require('../interfaces/sql')
  //const { connect } = require('../interfaces/sql')
  const sqlite3 = require('sqlite3').verbose()
  new sqlite3.Database(':memory:')

  const knex = await connect()

  if (!database.isTest) {
    throw new Error(
      'process.env.NODE_ENV is ok but, database configuration is not for TEST.'
    )
  }

  await knex.migrate.rollback(database, true)
  await knex.migrate.latest(database)
  await knex.seed.run(database)
  await openConnection()

  // eslint-disable-next-line no-console
  console.log(
    `All migrations and seed data was resetted in ${JSON.stringify(database.connection)}`
  )
})
