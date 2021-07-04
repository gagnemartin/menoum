import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { isSuccessResponse } from '../../../global/helpers'
import useFormInput from '../../../hooks/useFormInput'
import { useUserDispatch } from '../../../hooks/useUser'
import { actionTypes } from '../../../reducers/userReducer'
import { UsersService } from '../../../services'

const Login = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useUserDispatch()

  const email = useFormInput('')
  const password = useFormInput('')

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const errorMessage = 'Email address or password is incorrect. Please try again.'

  const login = async (data) => {
    dispatch({ type: actionTypes.request, loading: true })
    try {
      console.log(data)
      const payload = await UsersService.login(data)

      if (isSuccessResponse(payload)) {
        dispatch({ type: actionTypes.success, payload })
        return payload
      } else {
        throw payload
      }
    } catch (error) {
      dispatch({ type: actionTypes.error, error })
      return error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setHasError(false)
    setIsLoading(true)
    const data = { email: email.value, password: password.value }
    const response = await login(data)
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
      <input {...email} name='email' type='email' data-testid='login-input-email' />
      <input {...password} name='password' type='password' data-testid='login-input-password' />
      <button type='submit' disabled={isLoading} data-testid='login-button-submit'>
        Login
      </button>
    </form>
  )
}

export default Login
