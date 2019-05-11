const { insertUser } = require('../repository/user')
const { response } = require('../utils')
const logger = require('../utils/logger').get()

module.exports = async (req, res, next) => {
  try {
    const { username, updatedAt, id, createdAt } = await insertUser(req.body)
    res.send(response({ username, updatedAt, id, createdAt }))
  } catch (e) {
    logger.error(`Something wrong happend with Database Insertion, ${e}`)
    res.sendStatus(500)
    return next(e)
  }

  return next()
}
