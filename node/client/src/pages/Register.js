import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { useUserDispatch, register } from '../context/userContext'
import { isSuccessResponse } from '../global/helpers'

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
      default:
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setIsLoading(true)
    const data = { email, password, confirm_password: confirmPassword }
    const res = await register(dispatch, data)

    if (isSuccessResponse(res)) {
      const { from } = location.state || { from: { pathname: '/' } }
      setIsLoading(false)
      history.replace(from)
    } else {
      setErrors(res.data)
      setIsLoading(false)
    }
  }

  const showErrors = (errors) => {
    if (errors) {
      return Object.keys(errors).map((error) => <p key={error}>{errors[error].message}</p>)
    }
  }

  return (
    <form onSubmit={handleSubmit} action='#'>
      <div>
        <input onChange={handleChange} name='email' type='email' value={email} />
        {showErrors(errors.email)}
      </div>

      <div>
        <input onChange={handleChange} name='password' type='password' value={password} />
        {showErrors(errors.password)}
      </div>

      <div>
        <input onChange={handleChange} name='confirm_password' type='password' value={confirmPassword} />
        {showErrors(errors.confirm_password)}
      </div>

      <div>
        <button type='submit' disabled={isLoading}>
          Register
        </button>
      </div>
    </form>
  )
}

export default Register
