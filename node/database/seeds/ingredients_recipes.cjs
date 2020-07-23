const faker = require('faker')
const { Client } = require('@elastic/elasticsearch')

const ElasticClient = new Client({ node: 'http://elastic:9200' })

faker.locale = 'fr'

const randomWord = (min, max) => {
  let word = faker.random.word()

  while (word.length < min || word.length > max) {
    word = faker.random.word()
  }

  return word
}

const createRecipes = numEntries => {
  const recipes = []

  for (let i = 0; i < numEntries; i++) {
    const recipe = {
      name: faker.lorem.sentence(5),
      steps: JSON.stringify(createSteps(5))
    }

    while (recipes.some(recipeArr => recipeArr.name === recipe.name) && recipe.name.length >= 255) {
      recipe.name = faker.lorem.sentence(5)
    }

    recipes.push(recipe)
  }

  return recipes
}

const createSteps = numSteps => {
  const steps = []

  for (let i = 0; i < numSteps; i++) {
    let step = faker.lorem.sentence(5)

    while (steps.some(stepArr => stepArr === step)) {
      step = faker.lorem.sentence(5)
    }

    steps.push(step)
  }

  return steps
}

const createIngredients = numEntries => {
  const ingredients = []

  for (let i = 0; i < numEntries; i++) {
    const ingredient = {
      name: randomWord(2, 40)
    }

    while (ingredients.some(ingredientArr => ingredientArr.name === ingredient.name)) {
      ingredient.name = randomWord(2, 40)
    }

    ingredients.push(ingredient)
  }

  return ingredients
}

async function seed(knex) {
  const Recipes = knex('recipes')
  const Ingredients = knex('ingredients')
  const IngredientsRecipes = knex('ingredients_recipes')
  const insertRecipes = createRecipes(30)
  const insertIngredients = createIngredients(300)

  // Empty the tables
  await Ingredients.del()
  await Recipes.del()
  await IngredientsRecipes.del()

  const { body: indexExists } = await ElasticClient.indices.exists({
    index: 'ingredients'
  })

  if (indexExists) {
    const deletees = await ElasticClient.deleteByQuery({
      index: 'ingredients',
      conflicts: 'proceed',
      body: {
        query: {
          match_all: {}
        }
      }
    })

    const deleteindex = await ElasticClient.indices.delete({
      index: 'ingredients'
    })
  }

  // Insert Ingredients and Recipes
  const [ ingredients, recipes ] = await Promise.all([
    Ingredients.insert(insertIngredients, [ 'id', 'uuid', 'name' ]),
    Recipes.insert(insertRecipes, [ 'id', 'uuid', 'name' ])
  ])

  // Insert ingredients in Elasticsearch
  // const ingredientsElastic = ingredients.flatMap(doc => {
  //   const { id, uuid, name } = doc
  //   return [ { index: { _index: 'ingredients' } }, { id, uuid, autocomplete: { name } } ]
  // })
  //const ingredientsElastic = ingredients.flatMap(doc => [ doc ])
  const ingredientsElastic = ingredients.flatMap(doc => [ { index: { _index: 'ingredients' } }, doc ])
  //console.log(ingredientsElastic)

  await ElasticClient.indices.create({
    index: 'ingredients'
  })
  console.log(ingredientsElastic, ingredients.length)
  await ElasticClient.indices.putMapping({
    index: 'ingredients',
    //type: 'text',
    body: {
      properties: {
        name: {
          type: 'completion',
          analyzer: 'simple',
          search_analyzer: 'simple'
        }
      }
    }
  })
  const { body: bulkResponse } = await ElasticClient.bulk({ refresh: true, body: ingredientsElastic })
  console.log(bulkResponse)

  const pivotData = []
  const ingredientsLength = ingredients.length
  const units = [
    'ml', 'g'
  ]

  // Loop through he recipes to add between 1 and 10 ingredients
  recipes.map(recipe => {
    const numIngredients = Math.ceil(Math.random() * 10)

    for (let i = 0; i < numIngredients; i++) {
      const alreadyExists = () => {
        return pivotData.some(data => {
          return data.ingredient_id === ingredientRecipe.ingredient_id && data.recipe_id === ingredientRecipe.recipe_id
        })
      }

      const ingredientRecipe = {
        recipe_id: recipe.id,
        ingredient_id: ingredients[ingredientsLength * Math.random() | 0].id,
        unit: units[units.length * Math.random() | 0],
        amount: Math.floor(Math.random() * 10)
      }

      // Recipe already has this ingredient associated
      while (alreadyExists()) {
        ingredientRecipe.ingredient_id = ingredients[ingredientsLength * Math.random() | 0].id
      }

      pivotData.push(ingredientRecipe)
    }
  })

  // Inserts seed entries
  return IngredientsRecipes.insert(pivotData)
}

module.exports = { seed }
