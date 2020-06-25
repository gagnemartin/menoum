const { onUpdateTrigger } = require('./../knexfile.cjs')

function up(knex) {
  return knex.schema.createTable('ingredients', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 50).notNullable().unique()
    table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).notNullable().unique()
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
    table.datetime('updated_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable()
    table.integer('recipe_count').defaultTo(0).notNullable()

    table.index('name')
    table.index('uuid')
  }).then(() => knex.raw(onUpdateTrigger({ table: 'ingredients', except_columns: 'recipe_count' })))
}

function down(knex) {
  return knex.schema.dropTable('ingredients')
}

module.exports = { up, down }
