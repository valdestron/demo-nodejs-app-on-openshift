const { insertUser } = require('../repository/user')
const { response } = require('../utils')
const logger = require('../utils/logger').get()

module.exports = async (req, res, next) => {
  try {
    const { username, name, id } = await insertUser(req.body)
    res.send(response({ username,  id, name }))
  } catch (e) {
    logger.error(`Something wrong happend with Database Insertion, ${e}`)
    res.sendStatus(500)
    return next(e)
  }

  return next()
}
