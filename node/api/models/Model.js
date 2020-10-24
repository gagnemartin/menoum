import Pluralize from 'pluralize'
import Database from '../database/database.js'
import ElasticClient from '../database/ElasticClient.js'
import AppError from '../helpers/AppError.js'

class Model {
  constructor(params) {
    const { table, relationships, sync } = params

    this.table = table
    this.relationships = this.getRelationshipsInfo(relationships)
    this.sync = sync || {}

    if (typeof this.sync.elasticsearch !== 'undefined') {
      this.elastic = new ElasticClient()
    }

    this.resetQueries()
  }

  hasElasticSync = () => {
    return typeof this.sync.elasticsearch !== 'undefined'
  }

  all = async () => {
    const query = this.query.clone()

    this.resetQueries()

    return query.then((data) => {
      const formattedData = []

      data.map((entry) => {
        formattedData.push(this.formatRelationshipsData(entry))
      })

      return formattedData
    })
  }

  get = async (condition) => {
    const query = this.query.where(condition).first().clone()

    this.resetQueries()

    return query
  }

  first = async () => {
    const query = this.query.first().clone()

    this.resetQueries()

    return query
      .then((data) => {
        return this.formatRelationshipsData(data)
      })
      .catch((e) => {
        throw new Error(e)
      })
  }

  insert = (data, returning = ['*'], elasticExtra = {}) => {
    const insertData = this.toJSON(data)
    const query = this.queryInsert.insert(insertData, returning).clone()

    this.resetQueries()

    return query
      .then(async (newData) => {
        const isBulk = data instanceof Array
        let returningData = isBulk ? newData : newData[0]

        if (!isBulk) {
          returningData = { ...returningData, ...elasticExtra }
        }

        // Sync with ElasticSearch
        if (this.hasElasticSync()) {
          await this.elasticInsert(returningData)
        }

        return returningData
      })
      .catch((e) => {
        throw new Error(e)
      })
  }

  elasticInsert = async (data) => {
    if (data instanceof Array) {
      const newIndexes = []

      data.map((newData) => {
        const newIndex = {}
        this.sync.elasticsearch.map((field) => (newIndex[field] = newData[field]))
        newIndexes.push(newIndex)
      })

      const elasticData = newIndexes.flatMap((doc) => [{ index: { _index: this.table } }, doc])

      return this.elastic.client.bulk({ refresh: true, body: elasticData })
    }

    const newIndex = {}
    this.sync.elasticsearch.map((field) => (newIndex[field] = data[field]))

    return this.elastic.client
      .index({
        index: this.table,
        body: newIndex
      })
      .then((elasticData) => {
        // Add the elastic_id to the postgres DB
        const elastic_id = elasticData.body._id
        this.updateByUuid(data.uuid, { elastic_id })
      })
      .catch((e) => {
        this.deleteByUuid(data.uuid)
        throw new Error(e)
      })
  }

  elasticUpdate = async (data) => {
    let { elastic_id } = data
    const fields = this.sync.elasticsearch
    const elasticData = { elastic_id }

    fields.map((field) => {
      if (data[field]) {
        return (elasticData[field] = data[field])
      }
    })

    if (typeof elasticData.elastic_id === 'undefined') {
      const dataDB = await this.get({ uuid: data.uuid })
      elasticData.elastic_id = dataDB.elastic_id
    }

    return this.elastic.client.update({
      id: elasticData.elastic_id,
      index: this.table,
      body: { doc: elasticData }
    })
  }

  updateByUuid = async (uuid, data, returning = ['*'], elasticExtra = {}) => {
    const updateData = this.toJSON(data)
    const query = this.query.where('uuid', uuid).update(updateData, returning).clone()

    this.resetQueries()

    return query.then(async (data) => {
      if (this.hasElasticSync()) {
        const elasticData = { ...data[0], ...elasticExtra }
        await this.elasticUpdate(elasticData)
      }

      return data[0]
    })
  }

  update = async (data, returning = ['*']) => {
    const updateData = this.toJSON(data)
    const query = this.query.where('id', data.id).update(updateData, returning).clone()

    this.resetQueries()

    return query.then((data) => {
      return data[0]
    })
  }

  deleteByUuid = async (uuid) => {
    this.where('uuid', uuid)

    const query = this.query.del().clone()

    this.resetQueries()

    if (this.hasElasticSync()) {
      await this.elasticDelete(uuid)
    }

    return query
  }

  delete = async (data) => {
    this.where('id', data)

    const query = this.query.del().clone()

    this.resetQueries()

    return query
  }

  elasticDelete = async (uuid) => {
    const dataDB = await this.get({ uuid })
    const elastic_id = dataDB.elastic_id

    return this.elastic.client.delete({
      id: elastic_id,
      index: this.table
    })
  }

  limit = (limit) => {
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

  select = (columns) => {
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
    this.query = Database.formatConditions(this.query, { column, arg1, arg2 })
    return this
  }

  with = (table) => {
    if (this.relationships[table]) {
      const relation = this.relationships[table]
      const type = relation.type

      if (type === 'many_to_many') {
        const { pivot_table, foreign_key } = relation

        this.query
          .leftJoin(pivot_table, {
            [`${this.table}.id`]: `${pivot_table}.${foreign_key}`
          })
          .leftOuterJoin(table, {
            [`${pivot_table}.ingredient_id`]: `${table}.id`
          })
      }
    }

    return this
  }

  error = (status, data) => {
    return new AppError(status, data)
  }

  manyToMany = (table) => {
    const relationship = this.getRelationship(table)
    const { pivot_table, foreign_key, association_key, primary_key, association_primary_key } = relationship

    this.select(Database.connect().raw(`json_agg(${pivot_table}) AS ${pivot_table}`))
    this.select(Database.connect().raw(`json_agg(${table}) AS ${table}`))

    this.query
      .leftJoin(pivot_table, {
        [`${this.table}.id`]: `${pivot_table}.${foreign_key}`
      })
      .leftOuterJoin(table, {
        [`${pivot_table}.${association_key}`]: `${table}.${association_primary_key}`
      })
    this.query.groupBy(`${this.table}.${primary_key}`)
    return this
  }

  resetQueries = () => {
    this.query = Database.connect().from(this.table)
    this.queryInsert = Database.connect().into(this.table)
    this.database = Database.connect()
  }

  getRelationshipsInfo = (relationships) => {
    const formattedRelationships = { ...relationships }
    const tables = Object.keys(formattedRelationships)

    tables.map((table) => {
      const relation = formattedRelationships[table]

      if (relation.type === 'many_to_many') {
        if (!relation.pivot_table) {
          const twoTables = [this.table, table].sort()
          relation.pivot_table = twoTables.join('_')
        }

        if (!relation.foreign_key) {
          relation.foreign_key = `${Pluralize.singular(this.table)}_id`
        }

        if (!relation.association_key) {
          relation.association_key = `${Pluralize.singular(table)}_id`
        }

        if (!relation.primary_key) {
          relation.primary_key = 'id'
        }

        if (!relation.association_primary_key) {
          relation.association_primary_key = 'id'
        }
      }
    })

    return formattedRelationships
  }

  getRelationship = (table) => {
    return this.relationships[table]
  }

  formatRelationshipsData = (data) => {
    if (!data) {
      return data
    }

    const formattedData = { ...data }

    if (this.relationships) {
      const tables = Object.keys(this.relationships)

      tables.map((table) => {
        const relationship = this.getRelationship(table)
        const { pivot_table, foreign_key, primary_key, association_key, association_primary_key } = relationship

        if (!formattedData[table] || !formattedData[table][0]) {
          formattedData[table] = []
        }

        if (!formattedData[pivot_table] || !formattedData[pivot_table][0]) {
          formattedData[pivot_table] = []
        }

        if (formattedData[table].length > 0 && formattedData[pivot_table].length > 0) {
          const dataMerged = []

          formattedData[table].map((assocData) => {
            const pivotObject = formattedData[pivot_table].find(
              (pivotData) =>
                pivotData[foreign_key] === formattedData[primary_key] && pivotData[association_key] === assocData[association_primary_key]
            )

            if (pivotObject) {
              dataMerged.push({
                ...pivotObject,
                [Pluralize.singular(table)]: assocData
              })
            }
          })

          delete formattedData[pivot_table]
          formattedData[table] = dataMerged
        } else {
          delete formattedData[pivot_table]
        }
      })
    }

    return formattedData
  }

  toJSON = (data) => {
    // Bulk insert/update
    if (data instanceof Array) {
      return data.map((obj) => this._toJSON(obj))
    }

    return this._toJSON(data)
  }

  _toJSON = (data) => {
    const castData = { ...data }
    const fields = Object.keys(castData)

    fields.map((field) => {
      if (castData[field] instanceof Array) {
        castData[field] = JSON.stringify(castData[field])
      }
    })

    return castData
  }

  pluck = (array, key) => {
    return array.map((o) => o[key])
  }
}

export default Model
