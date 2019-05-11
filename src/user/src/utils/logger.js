const { general } = require('../configuration')
const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf, prettyPrint } = format
const devLogFormat = printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
const currentFormat = general.devLogger ? devLogFormat : prettyPrint()

const loggerObj = createLogger({
  format: combine(
    timestamp(),
    currentFormat
  ),
  transports: [
    new transports.Console()
  ]
})

const getLogHandler = (type, prefix) => {
  return (arg1, ...args) => {
    if (general.appOnTest) {
      return
    }

    if (typeof arg1 === 'object') {
      loggerObj[type](`${prefix} - `, arg1, ...args)
    } else {
      loggerObj[type](`${prefix} - ${arg1}`, ...args)
    }
  }
}

const getLogger = (customPrefixes = []) => {
  const prefix = customPrefixes.length ? `${general.appName} - ${customPrefixes.join(' - ')}` : general.appName

  return {
    debug: getLogHandler('debug', prefix),
    info: getLogHandler('info', prefix),
    warn: getLogHandler('warn', prefix),
    error: getLogHandler('error', prefix)
  }
}

exports.get = getLogger
