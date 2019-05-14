const schemaUp = (t) => {
  t.string('name', 256)
}

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => schemaUp(table))
  ])
}

const schemaDown = (t) => {
  t.dropColumn('name')
}

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('users', (table) => schemaDown(table))
  ])
}
