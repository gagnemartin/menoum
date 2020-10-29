const { onUpdateTrigger } = require('./../knexfile.cjs')

async function up(knex) {
  return knex.schema
    .createTable('ingredients_recipes', function (table) {
      table.increments('id').unsigned().notNullable().unique()

      table.integer('ingredient_id').unsigned().notNullable()
      table.integer('recipe_id').unsigned().notNullable()

      table.string('unit', 20).defaultTo(null)
      table.integer('amount').defaultTo(null).unsigned()

      table
        .datetime('created_at', { precision: 6 })
        .defaultTo(knex.fn.now(6))
        .notNullable()
      table
        .datetime('updated_at', { precision: 6 })
        .defaultTo(knex.fn.now(6))
        .notNullable()

      table
        .foreign('ingredient_id')
        .references('ingredients.id')
        .onDelete('CASCADE')
      table.foreign('recipe_id').references('recipes.id').onDelete('CASCADE')
      table.unique(['ingredient_id', 'recipe_id'])
      table.index('ingredient_id')
      table.index('recipe_id')
    })
    .then(() => knex.raw(onUpdateTrigger({ table: 'ingredients_recipes' })))
}

async function down(knex) {
  return knex.schema
    .table('ingredients_recipes', function (table) {
      table.dropForeign('ingredient_id')
      table.dropForeign('recipe_id')
      table.dropIndex('ingredient_id')
      table.dropIndex('recipe_id')
      table.dropUnique(['ingredient_id', 'recipe_id'])
    })
    .dropTable('ingredients_recipes')
}

module.exports = { up, down }
