require('../utils/env')

const defaultDatabaseConfig = {
  client: 'mysql',
  useNullAsDefault: true,
  retryInterval: process.env.DATABASE_RETRY_INTERVAL || 5000,
  connection: process.env.DATABASE_CONN_STR || 'mysql://root:root@localhost:3306/users',
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  },
}

const unitTestDatabaseConfig = {
  ...defaultDatabaseConfig,
  connection: process.env.DATABASE_CONN_STR_UNIT || 'mysql://root:root@localhost:3306/users_unit_test',
  isTest: true,
  migrations: {
    directory: './src/migrations',
  },
  seeds: {
    directory: './src/seeds',
  }
}

const unitTestInMemoryDatabaseConfig = {
  ...defaultDatabaseConfig,
  client: 'sqlite',
  connection: {
    filename: 'file:inMemoryDb?mode=memory&cache=shared',
  },
  pool: {
    min: 1,
    max: 1,
    disposeTimeout: 360000*1000,
    idleTimeoutMillis: 360000*1000
  },
  isTest: true,
  migrations: {
    directory: './src/migrations',
  },
  seeds: {
    directory: './src/seeds',
  },
}

let config = defaultDatabaseConfig

if (process.env.NODE_ENV === 'in_memory') {
  config = unitTestInMemoryDatabaseConfig
}

if (process.env.NODE_ENV === 'test') {
  config = unitTestDatabaseConfig
}

module.exports = config
