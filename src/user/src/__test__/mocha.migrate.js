
if (process.env.NODE_ENV !== 'in_memory' && process.env.NODE_ENV !== 'test') {
  throw new Error('process.env.NODE_ENV is not one of test environments: in_memory or test')
}

before(async () => {
  const { database } = require('../configuration')
  const { connect, openConnection } = require('../interfaces/sql')

  const knex = await connect()

  if (!database.isTest) {
    throw new Error('process.env.NODE_ENV is ok but, database configuration is not for TEST.')
  }

  await knex.migrate.rollback(database, true)
  await knex.migrate.latest(database)
  await knex.seed.run(database)
  await openConnection()

  // eslint-disable-next-line no-console
  console.log(`All migrations and seed data was resetted in ${database.connection}`)
})
