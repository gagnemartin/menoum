const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  const error = {
    status: err.status,
    message: err.message
  }

  if (err.data) {
    error.data = err.data
  }

  return res.status(err.statusCode).json(error)
}

export default errorHandler
