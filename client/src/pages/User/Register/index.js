import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useUserDispatch } from '../../../hooks/useUser'
import { isSuccessResponse } from '../../../global/helpers'
import useFormInput from '../../../hooks/useFormInput'
import { actionTypes } from '../../../reducers/userReducer'
import { UsersService } from '../../../services'

const Register = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useUserDispatch()

  const email = useFormInput('')
  const password = useFormInput('')
  const confirmPassword = useFormInput('')

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const register = async (data) => {
    dispatch({ type: actionTypes.request, loading: true })
    try {
      const payload = await UsersService.register(data)

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

    setErrors({})
    setIsLoading(true)
    const data = { email: email.value, password: password.value, confirm_password: confirmPassword.value }
    const response = await register(data)

    if (isSuccessResponse(response)) {
      const { from } = location.state || { from: { pathname: '/' } }
      setIsLoading(false)
      history.replace(from)
    } else {
      setErrors(response.data)
      setIsLoading(false)
    }
  }

  const showErrors = (errors) => {
    if (errors) {
      return Object.keys(errors).map((error) => (
        <p key={error} data-testid='register-error-item'>
          {errors[error].message}
        </p>
      ))
    }
  }

  return (
    <form onSubmit={handleSubmit} action='#'>
      <div>
        <input {...email} name='email' type='email' data-testid='register-input-email' />
        {showErrors(errors.email)}
      </div>

      <div>
        <input {...password} name='password' type='password' data-testid='register-input-password' />
        {showErrors(errors.password)}
      </div>

      <div>
        <input
          {...confirmPassword}
          name='confirm_password'
          type='password'
          data-testid='register-input-password-confirm'
        />
        {showErrors(errors.confirm_password)}
      </div>

      <div>
        <button type='submit' disabled={isLoading} data-testid='register-button-submit'>
          Register
        </button>
      </div>
    </form>
  )
}

export default Register
