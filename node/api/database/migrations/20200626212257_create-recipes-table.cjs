const { onUpdateTrigger } = require('./../knexfile.cjs')

async function up(knex) {
  return knex.schema
    .createTable('recipes', function (table) {
      table.increments('id').unsigned().notNullable().unique()
      table.string('name', 255).notNullable()
      table
        .uuid('uuid')
        .defaultTo(knex.raw('uuid_generate_v4()'))
        .notNullable()
        .unique()
      table.string('elastic_id').defaultTo(null).unique()
      table.json('steps').notNullable()
      table.integer('prep_time').unsigned()
      table.integer('cook_time').unsigned()
      table.integer('yields').unsigned()
      table.integer('servings').unsigned()
      table.string('thumbnail', 255)
      table.string('source', 255)
      table
        .datetime('created_at', { precision: 6 })
        .defaultTo(knex.fn.now(6))
        .notNullable()
      table
        .datetime('updated_at', { precision: 6 })
        .defaultTo(knex.fn.now(6))
        .notNullable()
      table.integer('ingredient_count').defaultTo(0).notNullable()

      table.index('name')
      table.index('uuid')
    })
    .then(() => knex.raw(onUpdateTrigger({ table: 'recipes' })))
}

async function down(knex) {
  return knex.schema.dropTable('recipes')
}

module.exports = { up, down }
