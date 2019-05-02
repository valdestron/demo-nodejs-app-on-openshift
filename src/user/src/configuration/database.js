const loadEnv = () => {
  const path = require('path')
  const envPath = path.join(__dirname.replace(path.basename(__dirname), '../.env'))

  require('dotenv').load({ path: envPath })
}

loadEnv()

module.exports = {
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
  }
}
