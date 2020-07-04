import { Model } from './index.js'
import Validator from './Validator.js'

const params = {
  table: 'recipes',
  relationships: {
    ingredients: {
      type: 'many_to_many'
    }
  }
}

class Recipe extends Model {
  constructor(params) {
    super(params)
  }

  ingredients = () => {
    this.manyToMany('ingredients')

    return this
  }

  validate = data => {
    const validator = new Validator(data)

    return validator.validate({
      name: {
        required: [ true, 'Please provide a name.' ],
        type: [ 'string', 'The name must be a string.' ],
        betweenLength: [ 3, 255, 'The name should between 3 and 255 characters long.' ]
      },
      steps: {
        type: [ 'array', 'The steps must be of type Array.' ]
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

export default new Recipe(params)
