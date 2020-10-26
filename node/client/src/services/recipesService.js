import { useUserState } from '../context/userContext'
import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { version } = backendApi
const path = '/recipes'

const useRecipesService = () => {
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

    return await apiFetch.post(`${version}${path}/new`, options)
  }

  const suggest = async (q) => {
    return await apiFetch.get(`${version}${path}/suggest?${q}`)
  }

  return { add, suggest }
}

export default useRecipesService
