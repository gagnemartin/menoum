import { Model } from './index.js'

const params = {
  table: 'ingredients',
  relationships: {
    recipes: {
      type: 'many_to_many',
      pivot_table: 'ingredient_recipe'
    }
  }
}

class Ingredient extends Model {
  constructor(params) {
    super(params)
  }
}

export default new Ingredient(params)
