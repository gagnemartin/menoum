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

  register: async ({ email, password, confirm_password }) => {
    const options = {
      body: JSON.stringify({ email, password, confirm_password }),
      credentials: 'include'
    }

    return await apiFetch.post(`${base}${path}/register`, options)
  },

  refresh: async () => {
    const options = {
      credentials: 'include'
    }

    return await apiFetch.post(`${base}${path}/refresh`, options)
  },

  logout: async () => {
    const options = {
      credentials: 'include'
    }

    return await apiFetch.post(`${base}${path}/logout`, options)
  }
}

export default UsersService
