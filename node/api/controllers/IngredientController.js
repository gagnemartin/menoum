import { Controller } from './index.js'
import { Ingredient } from '../models/index.js'

class IngredientController extends Controller {
  constructor(model) {
    super(model)
  }

  all = async (req, res, next) => {
    const data = await Ingredient.select([
      'ingredients.id',
      'ingredients.name',
      'ingredients.uuid',
      'ingredients.recipe_count'
    ])
      .limit(20)
      .orderBy('ingredients.name', 'desc')
      .recipes()
      .all()

    return res.status(200).json(data)
  }

  get = async (req, res, next) => {
    const data = await Ingredient.select([
      'ingredients.id',
      'ingredients.name',
      'ingredients.uuid',
      'ingredients.recipe_count'
    ])
      .where('ingredients.uuid', req.params.uuid)
      .recipes()
      .first()

    if (data) {
      return res.status(200).json(data)
    }

    next(Recipe.error(400, errors))
  }

  search = async (req, res, next) => {
    const { q: query } = req.query
    const data = await Ingredient.searchByName(query)
    const sortedData = data.sort((a, b) =>
      a.score < b.score ? 1 : b.score < a.score ? -1 : 0
    )

    return res.status(200).json(sortedData)
  }

  new = async (req, res, next) => {
    const formData = Ingredient.transformData(req.body)

    const [isValid, errors] = await Ingredient.validate(formData)

    if (isValid) {
      const data = await Ingredient.insert(formData, [
        'id',
        'uuid',
        'name',
        'created_at',
        'recipe_count'
      ])

      delete data.id

      return res.status(201).json(data)
    }

    next(Recipe.error(400, errors))
  }

  update = async (req, res, next) => {
    const formData = Ingredient.transformData(req.body)
    const { uuid } = req.params

    const [isValid, errors] = await Ingredient.validate(formData)

    if (isValid) {
      const data = await Ingredient.updateByUuid(uuid, formData, [
        'uuid',
        'name',
        'created_at',
        'recipe_count'
      ])

      return res.status(200).json(data)
    }

    next(Recipe.error(400, errors))
  }

  delete = async (req, res, next) => {
    const { uuid } = req.params
    await Ingredient.deleteByUuid(uuid)

    return res.status(200).json({ message: 'Ingredient successfully deleted.' })
  }
}

export default new IngredientController(Ingredient)
