const logger = require('./logger').get()
const promisify = require('promisify')

let httpServer, shuttingDown

/**
 * @param {Error} err object from upstream
 * @returns {void} handles exception by calling gracefull shutdown
 */
function handleException(err) {
  if (err) {
    logger.info(`Forcing shutting down...${err}`)
  }

  handleGracefullShutdown()
}

/**
 * @returns {void} gracefull shutting down handler
 */
async function handleGracefullShutdown() {
  if (shuttingDown) {
    logger.info(`Forcing shutting down...`)
    return process.exit(1)
  }

  shuttingDown = true

  try {
    if (httpServer) {
      logger.info(`Closing http server...`)
      await promisify(httpServer.close).call(httpServer)
    }

    logger.info(`Gracefully shutting down...`)
  } catch (e) {
    if (e) {
      logger.info(`${e}`)
    }
  } finally {
    process.exit(0)
  }
}

module.exports = {
  handleException
}
