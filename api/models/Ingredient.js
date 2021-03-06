import { Model } from './index.js'
import Validator from './Validator.js'
//import ElasticClient from '../database/ElasticClient.js'

const params = {
  table: 'ingredients',
  relationships: {
    recipes: {
      type: 'many_to_many'
    }
  },
  sync: {
    elasticsearch: ['id', 'uuid', 'name']
  }
}

class Ingredient extends Model {
  constructor(params) {
    super(params)

    //this.elastic = new ElasticClient()
  }

  recipes = () => {
    this.manyToMany('recipes')
    return this
  }

  // elasticInsert = async data => {
  //   return this.elastic.client.index({
  //     index: this.table,
  //     body: {
  //       name: data.name,
  //       id: data.id,
  //       uuid: data.uuid
  //     }
  //   })
  //     .catch(e => {
  //       this.deleteByUuid(data.uuid)
  //       throw new Error(e)
  //     })
  // }

  searchByName = async (query) => {
    return this.elastic.client
      .search({
        index: this.table,
        body: {
          query: {
            multi_match: {
              query,
              type: 'bool_prefix',
              fields: ['name', 'name._2gram', 'name._3gram'],
              fuzziness: 'auto'
            }
          }
        }
      })
      .then((data) => {
        const suggestions = data.body.hits.hits
        return suggestions.flatMap((doc) => {
          return { name: doc._source.name, uuid: doc._source.uuid, score: doc._score }
        })
      })
      .catch((e) => {
        throw {
          message: e.meta.body.error.reason,
          type: e.meta.body.error.root_cause[0].type,
          status: e.meta.body.status
        }
      })
  }

  validate = async (data) => {
    const validator = new Validator(data)
    const validatedData = await validator.validate({
      name: {
        required: [true, 'Please provide a name.'],
        type: ['string', 'The name must be a string.'],
        betweenLength: [
          3,
          50,
          'The name should between 3 and 255 characters long.'
        ]
      }
    })

    return validatedData
  }

  transformData = (data) => {
    const transformedData = { ...data }

    if (typeof transformedData.name === 'string') {
      transformedData.name = transformedData.name.trim()
    }

    if (typeof transformedData.name === 'number') {
      transformedData.name = transformedData.name.toString()
    }

    return transformedData
  }
}

export default new Ingredient(params)
