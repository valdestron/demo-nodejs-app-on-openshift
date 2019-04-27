const moment = require('moment')
const User = require('../models/User')

const findByUsername = async (username) => {
  return await User
    .query()
    .where('username', username)
    .first()
}

const insertUser = async (data) => {
  await User
    .query()
    .insert({
      id: data.id,
      username: data.username,
      password: data.password,
      createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    })
}

const destroyUser = async (id) => {
  await User
    .query()
    .delete()
    .where('id', id)
}

const getUsers = async () => {
  await User.query()
}

module.exports = {
  findByUsername,
  insertUser,
  destroyUser,
  getUsers
}
