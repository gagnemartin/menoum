import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useUserState } from '../../hooks/useUser'
import { ACTION_TYPES } from '../../reducers/userReducer'

const ProtectedLink = (props) => {
  const userData = useUserState()
  const { children, role } = props
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const checkAuthenthicated = () => {
    const { status } = userData

    return status === ACTION_TYPES.success
  }

  const checkAuthorized = () => {
    const { status, user } = userData

    return status === ACTION_TYPES.success && user.role === role
  }

  useEffect(() => {
    if (userData.status === ACTION_TYPES.request) {
      setIsLoading(true)
    } else {
      setIsAuthenticated(checkAuthenthicated())
      setIsAuthorized(checkAuthorized())
      setIsLoading(false)
    }
  }, [userData])

  if (isLoading) return null

  if (isAuthenticated && isAuthorized) {
    return <Link {...props}>{children}</Link>
  }

  return null
}

ProtectedLink.propTypes = {
  to: PropTypes.string.isRequired,
  role: PropTypes.string
}

ProtectedLink.defaultProps = {
  role: 'user'
}

export default ProtectedLink
