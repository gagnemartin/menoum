import { useUserState } from '../context/userContext'
import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { version } = backendApi
const path = '/ingredients'

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

  return { search, add }
}

export default useIngredientsService
