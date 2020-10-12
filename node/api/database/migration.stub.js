async function up(knex) {
  return knex.schema.createTable('table_name', function (table) {
    table.increments('id').unsigned().notNullable()
  })
}

async function down(knex) {
  return knex.schema.dropTable('table_name')
}

module.exports = { up, down }
