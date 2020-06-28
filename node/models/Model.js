import Database from '../database/database.js'

class Model {
  constructor(params) {
    const { table, relationships } = params

    this.table = table
    this.relationships = relationships

    this.resetQuery()
  }

  all = () => {
    const query = this.query.clone()
    this.resetQuery()
    return query
  }

  first = async () => {
    const query = this.query.first().clone()
    this.resetQuery()
    return query
  }

  limit = limit => {
    this.query.limit(limit)
    return this
  }

  orderBy = (column, direction = null) => {
    if (direction !== null) {
      this.query.orderBy(column, direction)
    } else {
      this.query.orderBy(column)
    }

    return this
  }

  select = columns => {
    this.query.select(columns)
    return this
  }

  /**
   * Where clause
   *
   * @param {string} column
   * @param {string|number} arg1 Operator or Value
   * @param {string|number|null} arg2 Value
   * @returns {Model}
   */
  where = (column, arg1, arg2 = null) => {
    console.log(this.query.toString())
    this.query = Database.formatConditions(this.query, { column, arg1, arg2 })
    return this
  }

  resetQuery = () => {
    this.query = Database.connect().from(this.table)
  }
}

export default Model
