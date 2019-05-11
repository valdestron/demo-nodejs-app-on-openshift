const schemaUp = (t, k) => {
  t.timestamp('createdAt').notNullable().defaultTo(k.raw('CURRENT_TIMESTAMP'))
  t.timestamp('updatedAt').notNullable().defaultTo(k.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
}

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => schemaUp(table, knex))
  ])
}

const schemaDown = (t) => {
  t.dropColumn('createdAt')
  t.dropColumn('updatedAt')
}

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('users', (table) => schemaDown(table))
  ])
}
