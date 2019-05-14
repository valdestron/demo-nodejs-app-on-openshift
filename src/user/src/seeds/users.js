const bcrypt = require('bcryptjs')

exports.seed = function(knex, Promise) {
  const users = [
    { id: 1, username: 'demo', name: 'John', password: bcrypt.hashSync('demo', 10) },
    { id: 2, username: 'demo2', name: 'Michele', password: bcrypt.hashSync('demo2', 10) },
    { id: 3, username: 'admin', name: 'Oftarayumauambua', password: bcrypt.hashSync('admin', 10) }
  ]

  return Promise
    .all([
      knex('users').del(),
    ])
    .then(() => {
      return knex('users').insert(users)
    })
}
