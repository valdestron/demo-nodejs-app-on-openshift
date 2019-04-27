const { general } = require('../configuration')
const { createLogger, format, transports } = require('winston')

const { combine, timestamp, printf, prettyPrint } = format
const devLogFormat = printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
const currentFormat = general.devLogger ? devLogFormat : prettyPrint()

module.exports = createLogger({
  format: combine(
    timestamp(),
    currentFormat
  ),
  transports: [
    new transports.Console()
  ]
})
