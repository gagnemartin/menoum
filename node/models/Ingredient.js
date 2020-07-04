import { Model } from './index.js'
import Validator from './Validator.js'

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
  }

  recipes = () => {
    this.manyToMany('recipes')
    return this
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
