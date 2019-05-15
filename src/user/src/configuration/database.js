require('../utils/env')

const testMigrationConfig = process.env.NODE_ENV === 'in_memory_not_test' ? {} : {
  migrations: {
    directory: './src/migrations',
  },
  seeds: {
    directory: './src/seeds',
  }
}

const defaultDatabaseConfig = {
  client: 'mysql',
  useNullAsDefault: true,
  retryInterval: process.env.DATABASE_RETRY_INTERVAL || 5000,
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'users',
  },
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
  ...testMigrationConfig
}

const unitTestInMemoryDatabaseConfig = {
  ...defaultDatabaseConfig,
  client: 'sqlite3',
  connection: { filename: 'sqliteInMemory:inMemoryDb?mode=memory&cache=shared' },
  pool: {
    min: 1,
    max: 1,
    disposeTimeout: 360000 * 1000,
    idleTimeoutMillis: 360000 * 1000
  },
  isTest: true,
  ...testMigrationConfig
}

let config = defaultDatabaseConfig

if (process.env.NODE_ENV === 'memory' || process.env.NODE_ENV === 'in_memory_not_test') {
  config = unitTestInMemoryDatabaseConfig
}

if (process.env.NODE_ENV === 'test') {
  config = unitTestDatabaseConfig
}

module.exports = config
