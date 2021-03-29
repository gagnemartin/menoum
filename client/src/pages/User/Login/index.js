import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { login } from '../../../context/userContext'
import { isSuccessResponse } from '../../../global/helpers'
import { useUserDispatch } from '../../../hooks/useUser'

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
    const response = await login(dispatch, data)
    setIsLoading(false)
    if (isSuccessResponse(response)) {
      const { from } = location.state || { from: { pathname: '/' } }
      history.replace(from)
    } else {
      setHasError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} action='#'>
      {hasError && <p data-testid='login-error-message'>{errorMessage}</p>}
      <input onChange={handleChange} name='email' type='email' value={email} data-testid='login-input-email' />
      <input onChange={handleChange} name='password' type='password' value={password} data-testid='login-input-password' />
      <button type='submit' disabled={isLoading} data-testid='button-login' data-testid='login-button-submit'>
        Login
      </button>
    </form>
  )
}

export default Login
