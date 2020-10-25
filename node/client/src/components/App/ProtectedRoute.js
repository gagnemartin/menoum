import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useUserState } from '../../context/userContext'

const ProtectedRoute = (props) => {
  const { children, component, role } = props
  const userData = useUserState()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const Component = component

  const checkAuthenthicated = () => {
    const { status, user } = userData

    if (status === 'SUCCESS') {
      if (role) return user.role === role

      return true
    }

    return false
  }

  useEffect(() => {
    if (userData.status === 'REQUEST') {
      setIsLoading(true)
    } else {
      setIsAuthenticated(checkAuthenthicated())
      setIsLoading(false)
    }
  }, [userData])

  if (isLoading) return null

  if (isAuthenticated) {
    if (component) {
      return <Component />
    }

    return children
  } else {
    return <Redirect to={{ pathname: '/login' }} />
  }
}

export default ProtectedRoute
