const defaultHeaders = {
  'Content-Type': 'application/json'
}

const apiFetch = {
  get: async (url) => {
    const data = await fetch(url)
    return data.json()
  },

  post: async (url, serviceOptions) => {
    const options = {
      method: 'POST',
      headers: defaultHeaders,
      ...serviceOptions
    }

    const data = await fetch(url, options)
    return data.json()
  },

  put: async (url, serviceOptions) => {
    const options = {
      method: 'PUT',
      headers: defaultHeaders,
      ...serviceOptions
    }

    const data = await fetch(url, options)
    return data.json()
  },

  delete: async (url) => {
    const options = {
      method: 'DELETE',
      headers: defaultHeaders
    }

    const data = await fetch(url, options)
    return data.json()
  }
}

export default apiFetch
