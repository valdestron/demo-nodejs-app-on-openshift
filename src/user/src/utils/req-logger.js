const logger = require('./logger')

const setLogger = (req, res, next) => {
  req.log = logger.get([
    'req',
    req.header('x-forwarded-for') || req.connection.remoteAddress,
    req.method,
    req.originalUrl
  ])

  req.log.info('arrived.')
  next()
}

module.exports = setLogger
