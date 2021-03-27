import { useUserState } from '../hooks/useUser'
import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { version } = backendApi
const path = '/ingredients'

const formatQueryString = (key, data) => {
  return data
    .filter((value) => value.length > 0)
    .map((value) => {
      return `${key}[]=${value}`
    })
    .join('&')
}

const useIngredientsService = () => {
  const user = useUserState()

  const search = async (q) => {
    return await apiFetch.get(`${version}${path}/search?q=${q}`)
  }

  const add = async ({ name }) => {
    const options = {
      body: JSON.stringify({ name }),
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${user.user.token}`
      }
    }

    return await apiFetch.post(`${version}${path}/new`, options)
  }

  const getByUuids = async (uuids) => {
    const queryString = formatQueryString('uuids', uuids)
    return await apiFetch.get(`${version}${path}/getByUuids?${queryString}`)
  }

  return { search, add, getByUuids }
}

export default useIngredientsService
