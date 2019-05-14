require('./utils/env')
const logger = require('./utils/logger').get()
const db = require('./interfaces/sql')
const { loadServer } = require('./server')

/**
 * @returns {void} initializes api server
 */
async function start() {
  try {
    await db.openConnection()
  } catch (e) {
    logger.info(`Unable to establish DB Connection...${e}`)
  }

  try {
    await loadServer()
  } catch (e) {
    logger.error(`App can not be started...${e}`)
    return;
  }
}

start()
