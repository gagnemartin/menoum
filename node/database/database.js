import knex from 'knex'
import config from './config.cjs'

class Database {
  constructor() {
    this.database = init()
  }

  connect = () => {
    return this.database
  }

  test = () => {
    let message = 'Could not connect to the database.'

    if (typeof this.database !== 'undefined') {
      message = 'Successfully connected to the database.'
    }

    console.log(message)
  }

  buildQuery = (db, options = {}) => {
    const query = db
      .select(options.columns || '*')

    if (options.limit) {
      query.limit(limit)
    }

    if (options.where instanceof Array) {
      options.where.map(option => {
        if (option.length > 2) {
          query.where(option[0], option[1], option[2])
        } else {
          query.where(option[0], option[1])
        }
      })
    }

    if (typeof options.orderBy !== 'undefined') {
      if (options.orderBy instanceof Array) {
        if (options.orderBy.length > 1) {
          query.orderBy(options.orderBy[0], options.orderBy[1])
        } else {
          query.orderBy(options.orderBy[0], options.orderBy[1])
        }
      } else {
        query.orderBy(options.orderBy)
      }
    }

    return query
  }
}

const init = () => {
  try {
    return knex(config.database)
  } catch (e) {
    console.error('Error while connecting to the database.', e)
  }
}

export default new Database()
