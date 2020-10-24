import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { base } = backendApi
const path = '/users'

const UsersService = {
  login: async ({ email, password }) => {
    const options = {
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    }

    return await apiFetch.post(`${base}${path}/login`, options)
  },

  refresh: async () => {
    const options = {
      credentials: 'include'
    }

    return await apiFetch.post(`${base}${path}/refresh`, options)
  }

  // new: async ({ name }) => {
  //   const options = {
  //     body: JSON.stringify({ name })
  //   }

  //   return await apiFetch.post(`${base}${path}/new`, options)
  // }
}

export default UsersService
