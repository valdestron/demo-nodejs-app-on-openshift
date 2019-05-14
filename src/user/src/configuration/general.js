module.exports = {
  appName: process.env.APP_NAME || 'Users API',
  devLogger: process.env.DEV_LOGGER || true,
  appHost: process.env.APP_HOST || 'localhost',
  appPort: process.env.APP_PORT || 3003,
  appOnTest: (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'memory') || false
}
