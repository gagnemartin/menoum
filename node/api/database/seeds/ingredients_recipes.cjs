const faker = require('faker')
const { Client } = require('@elastic/elasticsearch')

const ElasticClient = new Client({ node: 'http://elastic:9200' })

const NUM_RECIPES = 30
const NUM_INGREDIENTS = 300

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
  const thumbnails = [
    'https://cdn.pixabay.com/photo/2015/08/25/03/50/background-906135_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/09/17/17/19/egg-944495_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/03/26/09/39/cupcakes-690040_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/12/08/00/58/italian-1082230_1280.jpg',
    'https://cdn.pixabay.com/photo/2020/02/02/15/07/meat-4813261_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/03/17/10/29/breakfast-2151201_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/11/16/18/51/kagyana-2955466_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/10/13/19/00/potato-casserole-2848605_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/01/14/17/46/eat-1140371_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/10/16/09/01/hamburger-2856548_1280.jpg',
    'https://cdn.pixabay.com/photo/2013/03/13/19/15/italian-93237_1280.jpg',
    'https://cdn.pixabay.com/photo/2018/02/21/22/44/oatmeal-3171723_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/10/23/17/59/bread-2881871_1280.jpg'
  ]

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
      ingredient_count
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
  const insertRecipes = createRecipes(NUM_RECIPES)
  const insertIngredients = createIngredients(NUM_INGREDIENTS)

  // Empty the tables
  await Ingredients.del()
  await Recipes.del()
  await IngredientsRecipes.del()

  await ElasticClient.cluster.health({
    wait_for_status: 'yellow',
    timeout: '120s',
  })

  // Empty ElasticSearch
  const ingredientsIndex = await ElasticClient.indices.exists({
    index: 'ingredients'
  })

  const recipesIndex = await ElasticClient.indices.exists({
    index: 'recipes'
  })

  if (ingredientsIndex.body) {
    await ElasticClient.deleteByQuery({
      index: 'ingredients',
      conflicts: 'proceed',
      body: {
        query: {
          match_all: {}
        }
      }
    })

    await ElasticClient.indices.delete({
      index: 'ingredients'
    })
  }

  if (recipesIndex.body) {
    await ElasticClient.deleteByQuery({
      index: 'recipes',
      conflicts: 'proceed',
      body: {
        query: {
          match_all: {}
        }
      }
    })

    await ElasticClient.indices.delete({
      index: 'recipes'
    })
  }

  // Insert Ingredients and Recipes
  const [ingredients, recipes] = await Promise.all([
    Ingredients.insert(insertIngredients, ['id', 'uuid', 'name']),
    Recipes.insert(insertRecipes, ['id', 'uuid', 'name', 'ingredient_count'])
  ])

  const elasticIngredients = ingredients.flatMap(doc => [{ index: { _index: 'ingredients' } }, doc])

  await ElasticClient.indices.create({
    index: 'ingredients'
  })

  await ElasticClient.indices.putMapping({
    index: 'ingredients',
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

  await ElasticClient.bulk({ refresh: true, body: elasticIngredients })
  const elasticDataIngredients = await ElasticClient.search({
    index: 'ingredients',
    size: NUM_INGREDIENTS,
    body: {
      'query': {
        'match_all': {}
      }
    }
  })

  const ingredientsEntries = elasticDataIngredients.body.hits.hits
  const ingredientsUpdates = []

  ingredientsEntries.map(ingredient => {
    const { _id, _source: { uuid } } = ingredient

    ingredientsUpdates.push(
      knex('ingredients')
        .where({ uuid })
        .update({ elastic_id: _id })
    )
  })

  await Promise.all(ingredientsUpdates)

  const pivotData = []
  const ingredientsLength = ingredients.length
  const units = [
    'ml', 'g'
  ]

  const elasticRecipes = []
  // Loop through the recipes to add between 1 and 10 ingredients
  recipes.map(recipe => {
    const elasticRecipesIngredients = []

    for (let i = 0; i < recipe.ingredient_count; i++) {
      const alreadyExists = () => {
        return pivotData.some(data => {
          return data.ingredient_id === ingredientRecipe.ingredient_id && data.recipe_id === ingredientRecipe.recipe_id
        })
      }

      let ingredientKey = ingredientsLength * Math.random() | 0
      const ingredient_id = ingredients[ingredientKey].id
      const ingredientRecipe = {
        recipe_id: recipe.id,
        ingredient_id,
        unit: units[units.length * Math.random() | 0],
        amount: Math.floor(Math.random() * 10)
      }

      // Recipe already has this ingredient associated
      while (alreadyExists()) {
        ingredientKey = ingredientsLength * Math.random() | 0
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

  const elasticRecipesFormat = elasticRecipes.flatMap(doc => [{ index: { _index: 'recipes' } }, doc])
  await ElasticClient.bulk({ refresh: true, body: elasticRecipesFormat })
  const elasticDataRecipes = await ElasticClient.search({
    index: 'recipes',
    size: NUM_RECIPES,
    body: {
      'query': {
        'match_all': {}
      }
    }
  })

  const recipesEntries = elasticDataRecipes.body.hits.hits
  const recipesUpdates = []

  recipesEntries.map(recipe => {
    const { _id, _source: { uuid } } = recipe

    recipesUpdates.push(
      knex('recipes')
        .where({ uuid })
        .update({ elastic_id: _id })
    )
  })

  await Promise.all(recipesUpdates)

  // Inserts seed entries
  return IngredientsRecipes.insert(pivotData)
}

module.exports = { seed }
