const { onUpdateTrigger } = require('./../knexfile.cjs')

async function up(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').unsigned().notNullable().unique()
      table
        .uuid('uuid')
        .defaultTo(knex.raw('uuid_generate_v4()'))
        .notNullable()
        .unique()
      table.string('email').notNullable().unique()
      table.string('first_name')
      table.string('last_name')
      table.string('password').notNullable()
      table
        .enu('role', ['user', 'moderator', 'content_manager', 'admin'], {
          useNative: true,
          enumName: 'role'
        })
        .defaultTo('user')
      table.string('refresh_token').unique()
      table.boolean('is_active').defaultTo(true)
      table
        .datetime('created_at', { precision: 6 })
        .defaultTo(knex.fn.now(6))
        .notNullable()
      table
        .datetime('updated_at', { precision: 6 })
        .defaultTo(knex.fn.now(6))
        .notNullable()

      table.index('uuid')
    })
    .then(() => knex.raw(onUpdateTrigger({ table: 'users' })))
}

async function down(knex) {
  return knex.schema.dropTable('users')
}

module.exports = { up, down }
