import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useUserState } from '../../hooks/useUser'

const ProtectedLink = (props) => {
  const userData = useUserState()
  const { children, role, to } = props
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const checkAuthenthicated = () => {
    const { status } = userData

    return status === 'SUCCESS'
  }

  const checkAuthorized = () => {
    const { status, user } = userData

    return status === 'SUCCESS' && user.role === role
  }

  useEffect(() => {
    if (userData.status === 'REQUEST') {
      setIsLoading(true)
    } else {
      setIsAuthenticated(checkAuthenthicated())
      setIsAuthorized(checkAuthorized())
      setIsLoading(false)
    }
  }, [userData])

  if (isLoading) return null

  if (isAuthenticated && isAuthorized) {
    return <Link to={to}>{children}</Link>
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
