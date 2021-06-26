import { Controller } from './index.js'
import { Recipe } from '../models/index.js'

class RecipeController extends Controller {
  constructor(model) {
    super(model)
  }

  all = async (req, res, next) => {
    const data = await Recipe.select([
      'recipes.id',
      'recipes.uuid',
      'recipes.name',
      'recipes.steps',
      'recipes.created_at',
      'recipes.updated_at'
    ])
      .orderBy('recipes.name', 'desc')
      .ingredients()
      .all()

    return res.status(200).json(data)
  }

  get = async (req, res, next) => {
    const data = await Recipe.select(['recipes.*']).where('recipes.uuid', req.params.uuid).ingredients().first()

      if (data) {
        return res.status(200).json(Recipe.success(data))
      }

      next(Recipe.error(404))
  }

  suggest = async (req, res, next) => {
    const { uuids } = req.query
    const elasticData = await Recipe.suggestByIngredients(uuids)
    const elasticUuids = elasticData.map((recipe) => recipe.uuid)
    const data = await Recipe.select([
      'recipes.id',
      'recipes.uuid',
      'recipes.name',
      'recipes.steps',
      'recipes.thumbnail',
      'recipes.created_at',
      'recipes.updated_at'
    ])
      .where('recipes.uuid', elasticUuids)
      .ingredients()
      .all()

    const dataWithScore = data
      .map((recipe) => {
        const { score } = elasticData.find((elasticRecipe) => elasticRecipe.uuid === recipe.uuid)

        return { score, ...recipe }
      })
      .sort((a, b) => (a.score < b.score ? 1 : b.score < a.score ? -1 : 0))

    return res.status(200).json(Recipe.success(dataWithScore))
  }

  new = async (req, res, next) => {
    const formData = Recipe.transformData(req.body)
    const ingredientsInsert = formData.ingredients
    const elasticIngredients = Recipe.formatElasticIngredients(ingredientsInsert)
    const [isValid, errors] = await Recipe.validate(formData)

    if (isValid) {
      delete formData.ingredients
      const newData = await Recipe.insert(formData, ['id', 'uuid', 'name', 'steps', 'created_at', 'ingredient_count'], elasticIngredients)

      await Recipe.syncIngredients(newData.id, ingredientsInsert)

      const data = await Recipe.select([
        'recipes.id',
        'recipes.uuid',
        'recipes.name',
        'recipes.steps',
        'recipes.created_at',
        'recipes.updated_at'
      ])
        .where('recipes.uuid', newData.uuid)
        .ingredients()
        .first()

      return res.status(201).json(Recipe.success(data))
    }

    next(Recipe.error(400, errors))
  }

  update = async (req, res, next) => {
    delete req.body.uuid
    const { uuid } = req.params
    const formData = Recipe.transformData(req.body)
    const ingredientsInsert = formData.ingredients
    const elasticIngredients = Recipe.formatElasticIngredients(ingredientsInsert)
    const [isValid, errors] = await Recipe.validate(formData)

    if (isValid) {
      delete formData.ingredients
      const updateData = await Recipe.updateByUuid(uuid, formData, ['id', 'uuid'], elasticIngredients)

      await Recipe.syncIngredients(updateData.id, ingredientsInsert)

      const data = await Recipe.select([
        'recipes.id',
        'recipes.uuid',
        'recipes.name',
        'recipes.steps',
        'recipes.created_at',
        'recipes.updated_at'
      ])
        .where('recipes.uuid', updateData.uuid)
        .ingredients()
        .first()

      return res.status(200).json(Recipe.success(data))
    }
  
    next(Recipe.error(400, errors))
  }

  delete = async (req, res, next) => {
      const { uuid } = req.params
      await Recipe.deleteByUuid(uuid)

      return res.status(200).json(Recipe.success())
  }
}

export default new RecipeController(Recipe)
