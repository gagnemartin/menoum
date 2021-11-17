import { crawlerApi } from '../config/constants'
import apiFetch from '../global/apiFetch'
import { useUserState } from '../hooks/useUser'

const { version, base, port } = crawlerApi
console.log(`${base}:${port}${version}`)
const baseUrl = new URL(`${base}:${port}${version}`)
const { href } = baseUrl

const useCrawlerService = () => {
  const {
    user: { token }
  } = useUserState()

  const crawl = async (url) => {
    const options = {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    return await apiFetch.get(`${href}/crawl?url=${url}`, options)
  }

  return { crawl }

  // register: async ({ email, password, confirm_password }) => {
  //   const options = {
  //     body: JSON.stringify({ email, password, confirm_password }),
  //     credentials: 'include'
  //   }

  //   return await apiFetch.post(`${version}${path}/register`, options)
  // },

  // refresh: async () => {
  //   const options = {
  //     credentials: 'include'
  //   }

  //   return await apiFetch.post(`${version}${path}/refresh`, options)
  // },

  // logout: async () => {
  //   const options = {
  //     credentials: 'include'
  //   }

  //   return await apiFetch.post(`${version}${path}/logout`, options)
  // }
}

export default useCrawlerService
