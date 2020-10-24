class AppError extends Error {
  constructor(statusCode, data) {
    super(getMessageFromStatusCode(statusCode))

    this.statusCode = statusCode || 500
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, AppError)

    if (data) {
      this.data = data
    }
  }
}

const getMessageFromStatusCode = (statusCode) => {
  let message

  switch (statusCode) {
    case 400:
      message = 'Bad request'
      break
    case 401:
      message = 'Unauthorized'
      break
    case 403:
      message = 'Forbidden'
      break
    case 404:
      message = 'Not found'
      break
    case 500:
    default:
      message = 'Internal server error'
      break
  }

  return message
}

export default AppError
