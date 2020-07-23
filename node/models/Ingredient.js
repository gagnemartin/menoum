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

  searchByName = async query => {
    console.log(query)
    return this.elastic.client.search({
      index: this.table,
      //type: 'text',
      // size: 2,
      // from: 0,
      //suggest_mode: 'always',
      body: {
        // 'query': {
        //   'match_phrase_prefix': {
        //     'name': {
        //       'max_expansions': 25,
        //       'query': query
        //     }
        //   }
        // }
        suggest: {
          nameSuggester: {
            prefix: query,
            completion: {
              field: 'name',
              size: 90,
              fuzzy: {
                fuzziness: 'auto'
              }
            }
          }
        }
      }
    })
      .then(data => {
        const suggestions = data.body.suggest.nameSuggester
        const formattedSuggs = suggestions.flatMap(doc => {
          const options = doc.options

          return options.flatMap(sugg => [ { name: sugg.text, uuid: sugg._source.uuid, score: sugg._score } ])
        })
        console.log(formattedSuggs)
        return formattedSuggs
      })
      .catch(e => {
        console.log(e.meta.body.error.root_cause)
        throw {
          message: e.meta.body.error.reason,
          type: e.meta.body.error.root_cause[0].type,
          status: e.meta.body.status
        }
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
