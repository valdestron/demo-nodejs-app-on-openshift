const bcrypt = require('bcryptjs')

exports.seed = function(knex, Promise) {
  const users = [
    { id: 1, username: 'demo', password: bcrypt.hashSync('demo', 10) },
    { id: 2, username: 'demo2', password: bcrypt.hashSync('demo2', 10) },
    { id: 3, username: 'admin', password: bcrypt.hashSync('admin', 10) }
  ]

  return Promise
    .all([
      knex('users').del(),
    ])
    .then(() => {
      return knex('users').insert(users)
    })
}
