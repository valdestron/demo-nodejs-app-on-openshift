const findAllUsers = require('../middlewares/findAllUsers')
const findOneUser = require('../middlewares/findOneUser')
const insertUser = require('../middlewares/insertUser')
const destroyUser = require('../middlewares/destroyUser')
const health = require('../middlewares/health')

module.exports = (app) => {
  app.get('/health', health)
  app.get('/users', findAllUsers)
  app.get('/users/:id', findOneUser)
  app.post('/users', insertUser)
  app.delete('/users/:id', destroyUser)
}
