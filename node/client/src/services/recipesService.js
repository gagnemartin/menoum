import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { base } = backendApi
const path = '/recipes'

const RecipeService = {
  add: async ({
    name,
    thumbnail,
    prep_time,
    cook_time,
    yields,
    servings,
    steps,
    ingredients
  }) => {
    const body = {
      name,
      thumbnail,
      prep_time,
      cook_time,
      yields,
      servings,
      steps,
      ingredients
    }

    const options = {
      body: JSON.stringify(body)
    }

    return await apiFetch.post(`${base}${path}/new`, options)
  }
}

export default RecipeService
