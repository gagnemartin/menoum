import { Controller } from './index.js'
import { Ingredient } from '../models/index.js'

class IngredientController extends Controller {
  constructor(model) {
    super(model)
  }

  all = async (req, res, next) => {
    try {
      const data = await this.model.findAll({
        columns: [ 'name', 'uuid', 'recipe_count' ],
        orderBy: [ 'recipe_count', 'desc' ]
      })

      return res.status(200).json(data)
    } catch (e) {
      return res.status(404).json({
        message: e.message.replace(/"/g, ''),
        status: 404
      })
    }
  }

  get = async (req, res, next) => {
    try {
      const data = await this.model.find({
        columns: [ 'name', 'uuid', 'recipe_count' ],
        where: [
          [ 'uuid', req.params.uuid ]
        ]
      })

      return res.status(200).json(data)
    } catch (e) {
      return res.status(404).json({
        message: e.message.replace(/"/g, ''),
        status: 404
      })
    }
  }
}

export default new IngredientController(Ingredient)
