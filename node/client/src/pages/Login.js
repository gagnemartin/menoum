import React, { useState } from 'react'
import { useUserDispatch, login } from '../context/userContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useUserDispatch()

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

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = { email, password }
    login(dispatch, data)
  }

  return (
    <form onSubmit={handleSubmit} action='#'>
      <input onChange={handleChange} name='email' type='email' value={email} />
      <input onChange={handleChange} name='password' type='password' value={password} />
      <button type='submit'>Login</button>
    </form>
  )
}

export default Login
