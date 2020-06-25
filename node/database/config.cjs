// Update with your database settings.

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT } = process.env
const isNotProduction = process.env.NODE_ENV !== 'production'

module.exports = {
  database: {
    client: 'pg',
    connection: {
      'user': POSTGRES_USER,
      'password': POSTGRES_PASSWORD,
      'database': POSTGRES_DB,
      'host': POSTGRES_HOST,
      'port': POSTGRES_PORT,
      'debug': isNotProduction
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
      extension: 'cjs'
    },
    seeds: {
      directory: './database/seeds'
    },
    useNullAsDefault: true
  }
}
