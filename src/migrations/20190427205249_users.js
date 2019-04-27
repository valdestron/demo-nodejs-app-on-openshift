
const schema = (t) => {
  t.increments('id').primary()
  t.string('username', 256)
  t.string('password', 4096)
}

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => schema(table, knex))
  ])
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
}
