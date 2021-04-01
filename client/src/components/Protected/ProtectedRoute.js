import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import { useUserState } from '../../hooks/useUser'
import useAccessControl from '../../hooks/useAccessControl'
import { actionTypes } from '../../reducers/userReducer'

const ProtectedRoute = (props) => {
  const { children, component, exact, path, role } = props
  const userData = useUserState()
  const {  isAuthenticated, isAuthorized  } = useAccessControl()
  const [isLoading, setIsLoading] = useState(true)
  const Component = component

  useEffect(() => {
    if (userData.status === actionTypes.request) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [userData])

  if (isLoading) return null

  if (isAuthenticated()) {
    if (!isAuthorized(role)) {
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
