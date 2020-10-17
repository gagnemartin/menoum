import { backendApi } from '../config/constants'
import apiFetch from '../global/apiFetch'

const { base } = backendApi
const path = '/ingredients'

const IngredientsService = {
  search: async (q) => {
    return await apiFetch.get(`${base}${path}/search?q=${q}`)
  },

  new: async ({ name }) => {
    const options = {
      body: JSON.stringify({ name })
    }

    return await apiFetch.post(`${base}${path}/new`, options)
  }
}

export default IngredientsService
