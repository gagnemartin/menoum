const RecipeService = {
  add: async ({
    name,
    prep_time,
    cook_time,
    yields,
    servings,
    steps,
    ingredients
  }) => {
    const body = {
      name,
      prep_time,
      cook_time,
      yields,
      servings,
      steps,
      ingredients
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
    return await fetch(`http://localhost:4000/api/v1/recipes/new`, options)
      .then((data) => {
        return data.json()
      })
      .then((data) => {
        return data
      })
  }
}

export default RecipeService
