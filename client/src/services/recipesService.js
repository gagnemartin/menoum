import { useUserState } from '../context/userContext'
import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { version } = backendApi
const path = '/recipes'

const useRecipesService = () => {
  const user = useUserState()

  const get = async (uuid) => {
    return await apiFetch.get(`${version}${path}/get/${uuid}`)
  }

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

  const update = async ({ uuid, name, thumbnail, prep_time, cook_time, yields, servings, steps, ingredients }) => {
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

    return await apiFetch.put(`${version}${path}/update/${uuid}`, options)
  }

  const suggest = async (q) => {
    return await apiFetch.get(`${version}${path}/suggest?${q}`)
  }

  return { get, add, suggest, update }
}

export default useRecipesService
