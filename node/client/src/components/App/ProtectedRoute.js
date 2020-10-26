import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { useUserState } from '../../context/userContext'

const ProtectedRoute = (props) => {
  const { children, component, role } = props
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

    return children
  } else {
    return <Redirect to={{ pathname: '/login' }} />
  }
}

ProtectedRoute.propTypes = {
  role: PropTypes.string
}

ProtectedRoute.defaultProps = {
  role: 'user'
}

export default ProtectedRoute
