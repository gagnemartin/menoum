import { Controller } from './index.js'
import { Recipe } from '../models/index.js'

class RecipeController extends Controller {
  constructor(model) {
    super(model)
  }

  all = async (req, res, next) => {
    try {
      const data = await Recipe
        .select([ 'recipes.id', 'recipes.name', 'recipes.steps', 'recipes.created_at', 'recipes.updated_at' ])
        .orderBy('recipes.name', 'desc')
        .ingredients()
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
      const data = await Recipe
        .select([ 'recipes.id', 'recipes.name', 'recipes.steps', 'recipes.created_at', 'recipes.updated_at' ])
        .where('recipes.uuid', req.params.uuid)
        .ingredients()
        .first()

      return res.status(200).json(data)
    } catch (e) {
      return res.status(404).json({
        message: e.message.replace(/"/g, ''),
        status: 404
      })
    }
  }

  new = async (req, res, next) => {
    try {
      const formData = Recipe.transformData(req.body)
      const [ isValid, validatedData ] = Recipe.validate(formData)

      if (isValid) {
        const data = await Recipe
          .insert(formData, [ 'uuid', 'name', 'steps', 'created_at', 'ingredient_count' ])

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
      const formData = req.body
      const { uuid } = req.params

      if (Recipe.validate(formData)) {
        const data = await Recipe
          .updateByUuid(uuid, formData, [ 'uuid', 'name', 'steps', 'created_at', 'ingredient_count' ])

        return res.status(200).json(data)
      }

      return res.status(400).json({
        message: 'Invalid data.',
        status: 400
      })
    } catch (e) {

    }
  }

  delete = async (req, res, next) => {
    try {
      const { uuid } = req.params
      await Recipe.deleteByUuid(uuid)

      return res.status(200).json({ message: 'Recipe successfully deleted.' })
    } catch (e) {

    }
  }
}

export default new RecipeController(Recipe)
