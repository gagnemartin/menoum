const faker = require('faker')
const { Client } = require('@elastic/elasticsearch')
const { ingredients: ingredientsMock, sections } = require('../../mocks/ingredients.json')
const { thumbnails } = require('../../mocks/recipes.json')

const ElasticClient = new Client({ node: 'http://elastic:9200' })

const NUM_RECIPES = 300
const NUM_INGREDIENTS = ingredientsMock.length

faker.locale = 'fr'

const createRecipes = (numEntries) => {
  const recipes = []

  const thumbnailsArrEnd = thumbnails.length - 1

  for (let i = 0; i < numEntries; i++) {
    const ingredient_count = Math.ceil(Math.random() * 10)
    const servings = faker.random.number({ min: 1, max: 5 })
    const recipe = {
      name: faker.lorem.sentence(5),
      steps: JSON.stringify(createSteps(5)),
      prep_time: faker.random.number({ min: 0, max: 30 }),
      cook_time: faker.random.number({ min: 0, max: 120 }),
      yields: servings,
      servings,
      thumbnail: thumbnails[faker.random.number({ min: 0, max: thumbnailsArrEnd })],
      is_visible: true,
      ingredient_count
    }

    while (
      recipes.some((recipeArr) => recipeArr.name === recipe.name) &&
      recipe.name.length >= 255
    ) {
      recipe.name = faker.lorem.sentence(5)
    }

    recipes.push(recipe)
  }

  return recipes
}

const createSteps = (numSteps) => {
  const steps = []

  for (let i = 0; i < numSteps; i++) {
    let step = faker.lorem.sentence(5)

    while (steps.some((stepArr) => stepArr === step)) {
      step = faker.lorem.sentence(5)
    }

    steps.push(step)
  }

  return steps
}

async function seed(knex) {
  const Recipes = knex('recipes')
  const Ingredients = knex('ingredients')
  const IngredientsRecipes = knex('ingredients_recipes')
  const insertRecipes = createRecipes(NUM_RECIPES)
  const insertIngredients = ingredientsMock

  // Empty the tables
  await Ingredients.del()
  await Recipes.del()
  await IngredientsRecipes.del()

  await ElasticClient.cluster.health({
    wait_for_status: 'yellow',
    timeout: '120s'
  })

  await ElasticClient.deleteByQuery({
    index: 'ingredients',
    conflicts: 'proceed',
    body: {
      query: {
        match_all: {}
      }
    }
  })

  await ElasticClient.deleteByQuery({
    index: 'recipes',
    conflicts: 'proceed',
    body: {
      query: {
        match_all: {}
      }
    }
  })


  // Insert Ingredients and Recipes
  const [ingredients, recipes] = await Promise.all([
    Ingredients.insert(insertIngredients, ['id', 'uuid', 'name']),
    Recipes.insert(insertRecipes, ['id', 'uuid', 'name', 'ingredient_count'])
  ])

  const elasticIngredients = ingredients.flatMap((doc) => [
    { index: { _index: 'ingredients' } },
    doc
  ])

  await ElasticClient.bulk({ refresh: true, body: elasticIngredients })
  const elasticDataIngredients = await ElasticClient.search({
    index: 'ingredients',
    size: NUM_INGREDIENTS,
    body: {
      query: {
        match_all: {}
      }
    }
  })

  const ingredientsEntries = elasticDataIngredients.body.hits.hits
  const ingredientsUpdates = []

  ingredientsEntries.map((ingredient) => {
    const {
      _id,
      _source: { uuid }
    } = ingredient

    ingredientsUpdates.push(
      knex('ingredients').where({ uuid }).update({ elastic_id: _id })
    )
  })

  await Promise.all(ingredientsUpdates)

  const pivotData = []
  const ingredientsLength = ingredients.length
  const units = ['ml', 'g']

  const elasticRecipes = []
  // Loop through the recipes to add between 1 and 10 ingredients
  recipes.map((recipe) => {
    const elasticRecipesIngredients = []

    for (let i = 0; i < recipe.ingredient_count; i++) {
      const alreadyExists = () => {
        return pivotData.some((data) => {
          return (
            data.ingredient_id === ingredientRecipe.ingredient_id &&
            data.recipe_id === ingredientRecipe.recipe_id &&
            data.section === ingredientRecipe.section
          )
        })
      }

      let ingredientKey = (ingredientsLength * Math.random()) | 0
      const ingredient_id = ingredients[ingredientKey].id
      const ingredientRecipe = {
        recipe_id: recipe.id,
        ingredient_id,
        unit: units[(units.length * Math.random()) | 0],
        amount: Math.floor(Math.random() * 10)
      }

      if (i === 0) {
        ingredientRecipe.is_main = true
      }

      if (recipe.ingredient_count > 5) {
        ingredientRecipe.section = sections[(sections.length * Math.random()) | 0]
      }

      // Recipe already has this ingredient associated
      while (alreadyExists()) {
        ingredientKey = (ingredientsLength * Math.random()) | 0
        ingredientRecipe.ingredient_id = ingredients[ingredientKey].id
      }

      elasticRecipesIngredients.push({ uuid: ingredients[ingredientKey].uuid })
      pivotData.push(ingredientRecipe)
    }

    elasticRecipes.push({
      name: recipe.name,
      uuid: recipe.uuid,
      id: recipe.id,
      ingredients: elasticRecipesIngredients
    })
  })

  const elasticRecipesFormat = elasticRecipes.flatMap((doc) => [
    { index: { _index: 'recipes' } },
    doc
  ])
  await ElasticClient.bulk({ refresh: true, body: elasticRecipesFormat })
  const elasticDataRecipes = await ElasticClient.search({
    index: 'recipes',
    size: NUM_RECIPES,
    body: {
      query: {
        match_all: {}
      }
    }
  })

  const recipesEntries = elasticDataRecipes.body.hits.hits
  const recipesUpdates = []

  recipesEntries.map((recipe) => {
    const {
      _id,
      _source: { uuid }
    } = recipe

    recipesUpdates.push(
      knex('recipes').where({ uuid }).update({ elastic_id: _id })
    )
  })

  await Promise.all(recipesUpdates)

  // Inserts seed entries
  return IngredientsRecipes.insert(pivotData)
}

module.exports = { seed }
