const { destroyUser } = require('../repository/user')
const { response } = require('../utils')
const logger = require('../utils/logger').get()

module.exports = async (req, res, next) => {
  try {
    await destroyUser(req.params.id)
    res.send(response())
  } catch (e) {
    logger.error(`Something wrong happend during destroy operation, ${e}`)
    res.sendStatus(500)
    return next(e)
  }

  return next()
}
