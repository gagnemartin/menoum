import { Model } from './index.js'
import Validator from './Validator.js'
import ElasticClient from '../database/ElasticClient.js'

const params = {
  table: 'ingredients',
  relationships: {
    recipes: {
      type: 'many_to_many'
    }
  }
}

class Ingredient extends Model {
  constructor(params) {
    super(params)

    this.elastic = new ElasticClient()
  }

  recipes = () => {
    this.manyToMany('recipes')
    return this
  }

  elasticInsert = async data => {
    return this.elastic.client.index({
      index: this.table,
      body: {
        name: data.name,
        id: data.id
      }
    })
      .catch(e => {
        this.deleteByUuid(data.uuid)
        throw new Error(e)
      })
  }

  validate = data => {
    const validator = new Validator(data)

    return validator.validate({
      name: {
        required: [ true, 'Please provide a name.' ],
        type: [ 'string', 'The name must be a string.' ],
        betweenLength: [ 3, 50, 'The name should between 3 and 255 characters long.' ]
      }
    })
  }

  transformData = data => {
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
