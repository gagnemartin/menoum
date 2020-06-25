exports.up = function (knex) {
  return knex.schema.createTable('ingredients', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 50).notNullable().unique()
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
    table.datetime('modified_at')

    table.index('name')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('ingredients')
}
