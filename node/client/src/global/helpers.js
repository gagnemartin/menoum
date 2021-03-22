export const generateId = (length = 5) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export const isSuccessResponse = (response) => {
  const successStatus = 'success'

  if (response instanceof Object) {
    return response.status === successStatus
  }

  return response === successStatus
}

export const getDataFromResponse = (response) => {
  return response.data
}

export const formatArrayQuery = (key, data) => {
  return data.map((value) => {
        return `${key}=${value}`
      })
      .join('&')
}
