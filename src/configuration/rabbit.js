module.exports = {
  connStr: process.env.RABBIT_CONN_STR || 'amqp://guest:guest@localhost:5672/dev_vhost',
  retryInterval: process.env.RABBIT_RETRY_INTERVAL || 5000
}
