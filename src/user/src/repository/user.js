const bcrypt = require('bcryptjs')
const User = require('../models/User')

const findById = async (id) => {
  return await User
    .query()
    .where('id', id)
    .first()
    .select('username', 'name', 'id')
}

const insertUser = async (data) => {
  return await User
    .query()
    .insert({
      username: data.username,
      name: data.name,
      password: bcrypt.hashSync(data.password, 10),
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
    .select('username', 'name', 'id')
}

module.exports = {
  findById,
  insertUser,
  destroyUser,
  getUsers
}
