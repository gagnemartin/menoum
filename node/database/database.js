import knex from 'knex'
import config from './config.cjs'

class Database {
  constructor() {
    this.database = connect()
  }

  test() {
    let message = 'No connection to the database'

    if (typeof this.database !== 'undefined') {
      message = 'Database connection is alive.'
    }

    console.log(message)
    return this.database
  }
}

const connect = () => {
  try {
    return knex(config.database)
  } catch (e) {
    console.error('Error while connecting to the database.', e)
  }
}

// const database = () => {
//   const connect = () => {
//     try {
//       knex({
//         client: 'postgres',
//         connection: {
//           'username': POSTGRES_USER,
//           'password': POSTGRES_PASSWORD,
//           'database': POSTGRES_DB,
//           'host': 'database',
//           'debug': isNotProduction
//         }
//       })
//       console.log('Database connected.')
//     } catch (e) {
//       console.error(e)
//     }
//   }
// }

export default new Database()
