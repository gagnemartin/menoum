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

  formatConditions = (query, conditions) => {
    if (conditions instanceof Object) {
      const { column, arg1, arg2 } = conditions

      if (arg2 !== null) {
        query.where(column, arg1, arg2)
      } else {
        if (arg1 instanceof Array) {
          query.whereIn(column, arg1)
        } else {
          query.where(column, arg1)
        }
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
