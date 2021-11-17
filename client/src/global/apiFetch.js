const defaultHeaders = {
  'Content-Type': 'application/json'
}

const apiFetch = {
  get: async (url, serviceOptions) => {
    const options = {
      ...serviceOptions,
      method: 'GET'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  post: async (url, serviceOptions) => {
    const options = {
      ...serviceOptions,
      method: 'POST'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  put: async (url, serviceOptions) => {
    const options = {
      ...serviceOptions,
      method: 'PUT'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  delete: async (url, serviceOptions) => {
    const options = {
      ...serviceOptions,
      method: 'DELETE'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  }
}

export default apiFetch
