import { Model, Ingredient, IngredientRecipe } from './index.js'
import Validator from './Validator.js'

const params = {
  table: 'recipes',
  relationships: {
    ingredients: {
      type: 'many_to_many'
    }
  },
  sync: {
    elasticsearch: ['id', 'uuid', 'name', 'ingredients']
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

  suggestByIngredients = async (uuids) => {
    const matches = []
    const numUuids = uuids.length

    // Give a boost from the order of uuids. The lower the bigger the boost
    uuids.forEach((uuid, i) => {
      const boost = 1 * (numUuids - i)

      matches.push({
        match: {
          'ingredients.uuid': {
            query: uuid,
            boost
          }
        }
      })
    })

    return this.elastic.client
      .search({
        index: this.table,
        body: {
          query: {
            bool: {
              should: matches
            }
          }
        }
      })
      .then((data) => {
        const suggestions = data.body.hits.hits

        return suggestions.flatMap((doc) => {
          const { _score: score, _source: source } = doc
          return {
            name: source.name,
            uuid: source.uuid,
            score,
            ingredients: source.ingredients
          }
        })
      })
      .catch((e) => {
        throw {
          message: e.meta.body.error.reason,
          type: e.meta.body.error.root_cause[0].type,
          status: e.meta.body.status
        }
      })
  }

  validate = async (data) => {
    const validator = new Validator(data)
    const validatedData = await validator.validate({
      name: {
        required: [true, 'Please provide a name.'],
        type: ['string', 'The name must be a string.'],
        betweenLength: [
          3,
          255,
          'The name should between 3 and 255 characters long.'
        ]
      },
      yields: {
        required: [true, 'Please provide a number if yields.'],
        type: ['number', 'The yields must be an integer']
      },
      servings: {
        required: [true, 'Please provide a number of servings.'],
        type: ['number', 'The yields must be an integer']
      },
      steps: {
        type: ['array', 'The steps must be of type Array.']
      },
      ingredients: {
        required: [true, 'Please provide a list of ingredients.'],
        type: ['array', 'The steps must be of type Array.']
      }
    })

    return validatedData
  }

  transformData = (data) => {
    const transformedData = { ...data }

    if (typeof transformedData.name === 'string') {
      transformedData.name = transformedData.name.trim()
    }

    if (typeof transformedData.name === 'number') {
      transformedData.name = transformedData.name.toString()
    }

    if (typeof transformedData.prep_time === 'string') {
      transformedData.prep_time = parseInt(transformedData.prep_time)
    }

    if (typeof transformedData.cook_time === 'string') {
      transformedData.cook_time = parseInt(transformedData.cook_time)
    }

    if (typeof transformedData.yields === 'string') {
      transformedData.yields = parseInt(transformedData.yields)
    }

    if (typeof transformedData.servings === 'string') {
      transformedData.servings = parseInt(transformedData.servings)
    }

    if (transformedData.ingredients instanceof Array) {
      transformedData.ingredients.forEach((ingredient, i) => {
        if (typeof ingredient.unit === 'string') {
          transformedData.ingredients[i] = {
            ...ingredient,
            unit: ingredient.unit.trim()
          }
        }

        if (typeof ingredient.amount === 'string') {
          transformedData.ingredients[i] = {
            ...ingredient,
            amount: parseInt(ingredient.amount)
          }
        }
      })
    }

    if (transformedData.steps instanceof Array) {
      const steps = transformedData.steps
        .map((step) => step.trim())
        .filter((step) => step.length > 0)

      transformedData.steps = steps
    }

    return transformedData
  }

  syncIngredients = async (recipe_id, ingredients) => {
    try {
      const ingredientUuids = this.pluck(ingredients, 'uuid')
      const [ingredientsData, ingredientsRecipesData] = await Promise.all([
        Ingredient.where('uuid', ingredientUuids).all(),
        IngredientRecipe.where('recipe_id', recipe_id).all()
      ])
      const queries = []
      const toInsert = []
      const toUpdate = []
      const toDelete = []

      ingredients.map((ingredient) => {
        const { ingredient_recipe_id, uuid, unit, amount, section, is_main } = ingredient
        const ingredientData = ingredientsData.find((ingredientObj) => ingredientObj.uuid === uuid)

        // Ingredient is valid
        if (ingredientData) {
          const ingredientsRecipesInDb = ingredientsRecipesData.find((ingredientRecipe) =>
            ingredientRecipe.id === ingredient_recipe_id &&
            ingredientRecipe.recipe_id === recipe_id &&
            ingredientRecipe.ingredient_id === ingredientData.id
          )
          const newData = {
            recipe_id,
            ingredient_id: ingredientData.id,
            unit,
            amount,
            section: section || null,
            is_main: is_main || false
          }

          // Update data in pivot table
          if (ingredientsRecipesInDb) {
              toUpdate.push({ ...newData, id: ingredientsRecipesInDb.id })
          } else {
            // New entry in pivot table
            if (!ingredient_recipe_id) {
              toInsert.push(newData)
            }
          }
        }
      })

      ingredientsRecipesData.map((ingredientRecipe) => {
        const ingredientIsInForm = ingredients.some((ingredientRecipeObj) => ingredientRecipeObj.ingredient_recipe_id === ingredientRecipe.id)

        if (!ingredientIsInForm) {
          toDelete.push(ingredientRecipe.id)
        }
      })

      if (toInsert.length > 0) {
        queries.push(IngredientRecipe.insert(toInsert))
      }

      if (toUpdate.length > 0) {
        toUpdate.map((updateData) => {
          queries.push(IngredientRecipe.update(updateData))
        })
      }

      if (toDelete.length > 0) {
        queries.push(IngredientRecipe.delete(toDelete))
      }

      

      return Promise.all(queries)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  formatElasticIngredients = (data) => {
    return {
      ingredients: data.map((ingredient) => {
        return { uuid: ingredient.uuid }
      })
    }
  }
}

export default new Recipe(params)
