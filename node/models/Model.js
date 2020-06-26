import Database from '../database/database.js'

class Model {
  constructor(table) {
    this.table = table
    this.database = Database.connect().from(this.table)
  }

  findAll(options = {}) {
    const query = Database.buildQuery(this.database, options)

    return query
  }

  async find(options) {
    const query = Database.buildQuery(this.database, options)

    return query.first()
  }
}

export default Model
