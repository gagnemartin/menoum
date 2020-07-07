import { Controller } from './index.js'
import { Recipe } from '../models/index.js'

class RecipeController extends Controller {
  constructor(model) {
    super(model)
  }

  all = async (req, res, next) => {
    try {
      const data = await Recipe
        .select([ 'recipes.id', 'recipes.uuid', 'recipes.name', 'recipes.steps', 'recipes.created_at', 'recipes.updated_at' ])
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
    const data = await Recipe
      .select([ 'recipes.id', 'recipes.uuid', 'recipes.name', 'recipes.steps', 'recipes.created_at', 'recipes.updated_at' ])
      .where('recipes.uuid', req.params.uuid)
      .ingredients()
      .first()
      .catch(e => {
        return res.status(404).json({
          message: e.message.replace(/"/g, ''),
          status: 404
        })
      })

    return res.status(200).json(data)
  }

  new = async (req, res, next) => {
    try {
      const formData = Recipe.transformData(req.body)
      const ingredientsInsert = formData.ingredients
      delete formData.ingredients
      const [ isValid, errors ] = Recipe.validate(formData)

      if (isValid) {
        const newData = await Recipe
          .insert(formData, [ 'id', 'uuid', 'name', 'steps', 'created_at', 'ingredient_count' ])

        await Recipe.syncIngredients(newData.id, ingredientsInsert)

        const data = await Recipe
          .select([ 'recipes.id', 'recipes.uuid', 'recipes.name', 'recipes.steps', 'recipes.created_at', 'recipes.updated_at' ])
          .where('recipes.uuid', newData.uuid)
          .ingredients()
          .first()

        return res.status(201).json(data)
      }

      return res.status(400).json({
        message: 'Invalid data.',
        status: 400,
        data: errors
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
      const formData = Recipe.transformData(req.body)
      const ingredientsInsert = formData.ingredients
      delete formData.ingredients
      const { uuid } = req.params
      const [ isValid, errors ] = Recipe.validate(formData)

      if (isValid) {
        const updateData = await Recipe
          .updateByUuid(uuid, formData, [ 'id', 'uuid' ])

        await Recipe.syncIngredients(updateData.id, ingredientsInsert)

        const data = await Recipe
          .select([ 'recipes.id', 'recipes.uuid', 'recipes.name', 'recipes.steps', 'recipes.created_at', 'recipes.updated_at' ])
          .where('recipes.uuid', updateData.uuid)
          .ingredients()
          .first()

        return res.status(200).json(data)
      }

      return res.status(400).json({
        message: 'Invalid data.',
        status: 400,
        data: errors
      })
    } catch (e) {
      return res.status(404).json({
        message: e.message.replace(/"/g, ''),
        status: 404
      })
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
