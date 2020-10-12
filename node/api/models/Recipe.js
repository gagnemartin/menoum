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

  suggestByIngredients = async uuids => {
    const matches = []
    const numUuids = uuids.length

    // Give a boost from the order of uuids. The lower the bigger the boost
    uuids.forEach((uuid, i) => {
      const boost = 1 * (numUuids - i)

      matches.push({
        match: {
          "ingredients.uuid": {
            query: uuid,
            boost
          }
        }
      })
    })

    return this.elastic.client.search({
      index: this.table,
      body: {
        query: {
          bool: {
            should: matches
          }
        }
      }
    })
      .then(data => {
        const suggestions = data.body.hits.hits

        return suggestions.flatMap(doc => {
          const { _score: score, _source: source } = doc
          return {
            name: source.name,
            uuid: source.uuid,
            score,
            ingredients: source.ingredients,
          }
        })
      })
      .catch(e => {
        throw {
          message: e.meta.body.error.reason,
          type: e.meta.body.error.root_cause[0].type,
          status: e.meta.body.status
        }
      })
  }

  validate = data => {
    const validator = new Validator(data)

    return validator.validate({
      name: {
        required: [ true, 'Please provide a name.' ],
        type: [ 'string', 'The name must be a string.' ],
        betweenLength: [ 3, 255, 'The name should between 3 and 255 characters long.' ]
      },
      steps: {
        type: [ 'array', 'The steps must be of type Array.' ]
      }
    })
  }

  transformData = data => {
    const transformedData = { ...data }

    if (typeof transformedData.name === 'string') {
      transformedData.name = transformedData.name.trim()
    }

    if (typeof transformedData.name === 'number') {
      transformedData.name = transformedData.name.toString()
    }

    return transformedData
  }

  syncIngredients = async (recipe_id, ingredients) => {
    try {
      const ingredientUuids = this.pluck(ingredients, 'uuid')
      const [ ingredientsData, ingredientsRecipesData ] = await Promise.all([
        Ingredient.where('uuid', ingredientUuids).all(),
        IngredientRecipe.where('recipe_id', recipe_id).all()
      ])
      const queries = []
      const toInsert = []
      const toUpdate = []
      const toDelete = []

      ingredients.map(ingredient => {
        const { uuid, unit, amount } = ingredient
        const ingredientData = ingredientsData.find(ingredientObj => ingredientObj.uuid === uuid)

        // Ingredient is valid
        if (ingredientData) {
          const ingredientRecipeInDb = ingredientsRecipesData.find(ingredientRecipe => ingredientRecipe.ingredient_id === ingredientData.id && ingredientRecipe.recipe_id === recipe_id)
          const newData = {
            recipe_id,
            ingredient_id: ingredientData.id,
            unit,
            amount
          }

          // Update data in pivot table
          if (ingredientRecipeInDb) {
            toUpdate.push({ ...newData, id: ingredientRecipeInDb.id })
          } else {
            // New entry in pivot table
            toInsert.push(newData)
          }

        }
      })

      ingredientsRecipesData.map(ingredientRecipe => {
        const ingredientInForm = ingredientsData.find(ingredientObj => ingredientObj.id === ingredientRecipe.ingredient_id)

        if (!ingredientInForm) {
          toDelete.push(ingredientRecipe.id)
        }
      })

      if (toInsert.length > 0) {
        queries.push(IngredientRecipe.insert(toInsert))
      }

      if (toUpdate.length > 0) {
        toUpdate.map(updateData => {
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
      ingredients: data.map(ingredient => {
        return { uuid: ingredient.uuid }
      })
    }
  }
}

export default new Recipe(params)
