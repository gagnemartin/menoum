import { Model } from './index.js'

class Ingredient extends Model {
  constructor(table) {
    super(table)
  }
}

export default new Ingredient('ingredients')
