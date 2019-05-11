const { getUsers } = require('../repository/user')
const { response } = require('../utils')
const logger = require('../utils/logger').get()

module.exports = async (req, res, next) => {
  try {
    const users = await getUsers()
    res.send(response(users))
  } catch (e) {
    logger.error(`Something wrong happend during the users search, ${e}`)
    res.sendStatus(500)
    return next(e)
  }

  return next()
}
