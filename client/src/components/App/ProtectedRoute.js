import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import { useUserState } from '../../hooks/useUser'

const ProtectedRoute = (props) => {
  const { children, component, exact, path, role } = props
  const userData = useUserState()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const Component = component

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

  if (isAuthenticated) {
    if (!isAuthorized) {
      return <Redirect to={{ pathname: '/' }} />
    }
    
    if (component) {
      return <Component />
    }

    return (
      <Route exact={exact} path={path}>
        {children}
      </Route>
    )
  } else {
    return <Redirect to={{ pathname: '/login' }} />
  }
}

ProtectedRoute.propTypes = {
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  role: PropTypes.string
}

ProtectedRoute.defaultProps = {
  exact: false,
  role: 'user'
}

export default ProtectedRoute
