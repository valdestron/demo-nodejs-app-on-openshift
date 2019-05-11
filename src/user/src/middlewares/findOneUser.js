const { findById } = require('../repository/user')
const { response } = require('../utils')
const logger = require('../utils/logger').get()

module.exports = async (req, res, next) => {
  try {
    const user = await findById(req.params.id)

    if (!user) {
      res
        .status(500)
        .json(
          response({ fields: [ { id: 'Not found' } ] }, 500)
        )
    } else {
      res.send(response(user))
    }

  } catch (e) {
    logger.error(`Something wrong happend during the user search, ${e}`)
    res.sendStatus(500)
    return next(e)
  }

  return next()
}
