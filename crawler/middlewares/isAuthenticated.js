import jwt from 'jsonwebtoken'
import AppError from '../helpers/AppError.js'

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
      if (err) {
        return next(new AppError(403))
      }

      req.user = user
      next()
    })
  } else {
    return next(new AppError(401))
  }
}

export default isAuthenticated
