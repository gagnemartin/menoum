import { Controller } from './index.js'
import { Ingredient } from '../models/index.js'

class IngredientController extends Controller {
  constructor(model) {
    super(model)
  }

  all = async (req, res, next) => {
    try {
      const data = await Ingredient
        .select([ 'ingredients.id', 'ingredients.name', 'ingredients.uuid', 'ingredients.recipe_count' ])
        .limit(20)
        .orderBy('ingredients.name', 'desc')
        .recipes()
        .all()

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
      const data = await Ingredient
        .select([ 'ingredients.id', 'ingredients.name', 'ingredients.uuid', 'ingredients.recipe_count' ])
        .where('ingredients.uuid', req.params.uuid)
        .recipes()
        .first()

      return res.status(200).json(data)
    } catch (e) {
      return res.status(404).json({
        message: e.message.replace(/"/g, ''),
        status: 404
      })
    }
  }

  search = async (req, res, next) => {
    try {
      const { q: query } = req.query
      const data = await Ingredient.searchByName(query)
      return res.status(200).json(data)
    } catch (e) {
      return res.status(e.status).json({
        ...e,
        message: e.message.replace(/"/g, '')
      })
    }
  }

  new = async (req, res, next) => {
    try {
      const formData = Ingredient.transformData(req.body)

      const [ isValid, validatedData ] = Ingredient.validate(formData)

      if (isValid) {
        const data = await Ingredient
          .insert(formData, [ 'id', 'uuid', 'name', 'created_at', 'recipe_count' ])

        delete data.id

        return res.status(201).json(data)
      }

      return res.status(400).json({
        message: 'Invalid data.',
        status: 400,
        data: validatedData
      })
    } catch (e) {
      return res.status(404).json({
        message: e.message.replace(/"/g, ''),
        status: 404
      })
    }
  }

  update = async (req, res, next) => {
    try {
      const formData = Ingredient.transformData(req.body)
      const { uuid } = req.params

      const [ isValid, validatedData ] = Ingredient.validate(formData)

      if (isValid) {
        const data = await Ingredient
          .updateByUuid(uuid, formData, [ 'uuid', 'name', 'created_at', 'recipe_count' ])

        return res.status(200).json(data)
      }

      return res.status(400).json({
        message: 'Invalid data.',
        status: 400,
        data: validatedData
      })
    } catch (e) {

    }
  }

  delete = async (req, res, next) => {
    try {
      const { uuid } = req.params
      await Ingredient.deleteByUuid(uuid)

      return res.status(200).json({ message: 'Ingredient successfully deleted.' })
    } catch (e) {

    }
  }
}

export default new IngredientController(Ingredient)
