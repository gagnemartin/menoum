import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { version } = backendApi
const path = '/users'

const UsersService = {
  login: async ({ email, password }) => {
    const options = {
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    }

    return await apiFetch.post(`${version}${path}/login`, options)
  },

  register: async ({ email, password, confirm_password }) => {
    const options = {
      body: JSON.stringify({ email, password, confirm_password }),
      credentials: 'include'
    }

    return await apiFetch.post(`${version}${path}/register`, options)
  },

  refresh: async () => {
    const options = {
      credentials: 'include'
    }

    return await apiFetch.post(`${version}${path}/refresh`, options)
  },

  logout: async () => {
    const options = {
      credentials: 'include'
    }

    return await apiFetch.post(`${version}${path}/logout`, options)
  }
}

export default UsersService
