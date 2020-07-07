import { Model } from './index.js'
// import Validator from './Validator.js'

const params = {
  table: 'ingredients_recipes',
  relationships: {
    ingredients: {
      type: 'has_many'
    },
    recipes: {
      type: 'has_many'
    }
  }
}

class IngredientRecipe extends Model {
  constructor(params) {
    super(params)
  }
}

export default new IngredientRecipe(params)
