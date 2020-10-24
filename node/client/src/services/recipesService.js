import { useUserState } from '../context/userContext'
import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const useRecipeService = () => {
  const user = useUserState()

  const add = async ({ name, thumbnail, prep_time, cook_time, yields, servings, steps, ingredients }) => {
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
      body: JSON.stringify(body),
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${user.user.token}`
      }
    }

    return await apiFetch.post(`${base}${path}/new`, options)
  }
  return { add }
}

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
      body: JSON.stringify(body),
      credentials: 'include'
    }

    return await apiFetch.post(`${base}${path}/new`, options)
  }
}

export default RecipeService

export { useRecipeService }
