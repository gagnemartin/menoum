import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useUserDispatch, login } from '../context/userContext'

const Login = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useUserDispatch()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const errorMessage = 'Email address or password is incorrect. Please try again.'

  const handleChange = (e) => {
    const {
      target: { name, value }
    } = e

    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setHasError(false)
    setIsLoading(true)
    const data = { email, password }
    const res = await login(dispatch, data)
    
    if (res.status === 'success') {
      const { from } = location.state || { from: { pathname: '/' } }
      setIsLoading(false)
      history.replace(from)
    } else {
      setHasError(true)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} action='#'>
      { hasError &&
      <p>{errorMessage}</p>
      }
      <input onChange={handleChange} name='email' type='email' value={email} />
      <input onChange={handleChange} name='password' type='password' value={password} />
      <button type='submit' disabled={isLoading}>Login</button>
    </form>
  )
}

export default Login
