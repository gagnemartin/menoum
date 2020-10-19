/**
 * Checks if a user is authorized from a given role
 * Middleware "isAuthenticated" has to be ran before in the route
 * To access the property "user"
 *
 * @param {Aray|String} roles
 */
const isAuthorized = (roles) => {
  return (req, res, next) => {
    const { user } = req

    if (user) {
      if (roles instanceof Array) {
        if (!roles.includes(user.role)) {
          return res.sendStatus(403)
        }
      } else {
        if (roles !== user.role) {
          return res.sendStatus(403)
        }
      }

      next()
    } else {
      return res.sendStatus(401)
    }
  }
}

export default isAuthorized
