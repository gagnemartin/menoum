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
      ...serviceOptions
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  put: async (url, serviceOptions) => {
    const options = {
      method: 'PUT',
      ...serviceOptions
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  delete: async (url, serviceOptions) => {
    const options = {
      method: 'DELETE',
      ...serviceOptions
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  }
}

export default apiFetch
