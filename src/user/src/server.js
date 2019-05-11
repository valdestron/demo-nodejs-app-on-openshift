const logger = require('./utils/logger').get()
const { reqLogger } = require('./utils')
const { general } = require('./configuration')
const http = require('http')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const { handleException } = require('./utils/exceptionHandlers')

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true)
  },
  credentials: true
}

/**
 * @returns {Object} returns loaded express app
 */
async function loadServer() {
  const app = express()

  app.use(cors(corsOptions))
  app.use(reqLogger)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  routes(app)

  const server = http.createServer(app)

  server.on('error', handleException)
  server.on('close', () => logger.info(`Http server closed...`))
  server.listen(
    general.appPort,
    general.appHost,
    () => logger.info(`http - ${general.appHost}:${general.appPort} - listening for http requests.`)
  )

  return server
}


module.exports = {
  loadServer
}
