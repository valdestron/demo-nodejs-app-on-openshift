const moment = require('moment')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const findByUsername = async (username) => {
  return await User
    .query()
    .where('username', username)
    .first()
}

const insertUser = async (data) => {
  return await User
    .query()
    .insert({
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    })
    .returning('id')
}

const destroyUser = async (id) => {
  await User
    .query()
    .delete()
    .where('id', id)
}

const getUsers = async () => {
  return await User
    .query()
    .select('*')
}

module.exports = {
  findByUsername,
  insertUser,
  destroyUser,
  getUsers
}
