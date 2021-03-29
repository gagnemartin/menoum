import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { register } from '../../../context/userContext'
import { useUserDispatch } from '../../../hooks/useUser'
import { isSuccessResponse } from '../../../global/helpers'

const Register = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useUserDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
      case 'confirm_password':
        setConfirmPassword(value)
        break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setIsLoading(true)
    const data = { email, password, confirm_password: confirmPassword }
    const response = await register(dispatch, data)
    console.log(response)

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
        <input onChange={handleChange} name='email' type='email' value={email} data-testid='register-input-email' />
        {showErrors(errors.email)}
      </div>

      <div>
        <input onChange={handleChange} name='password' type='password' value={password} data-testid='register-input-password' />
        {showErrors(errors.password)}
      </div>

      <div>
        <input
          onChange={handleChange}
          name='confirm_password'
          type='password'
          value={confirmPassword}
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
