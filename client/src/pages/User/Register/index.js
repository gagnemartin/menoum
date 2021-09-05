import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useUserDispatch } from '../../../hooks/useUser'
import { isSuccessResponse } from '../../../global/helpers'
import useFormInput from '../../../hooks/useFormInput'
import { actionTypes } from '../../../reducers/userReducer'
import { UsersService } from '../../../services'
import { PageContainer, PageHeader, PageTitle } from '../../../components/Layout'

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
        <Grid item key={error} data-testid='register-error-item'>
          {errors[error].message}
        </Grid>
      ))
    }
  }

  return (
    <>
      <PageHeader>
        <PageTitle>Create a new account</PageTitle>
      </PageHeader>

      <PageContainer maxWidth='xs'>
        <form onSubmit={handleSubmit} action='#'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    {...email}
                    name='email'
                    type='email'
                    inputProps={{
                      'data-testid': 'register-input-email'
                    }}
                    label='Email Address'
                    InputLabelProps={{ required: false }}
                    error={errors.email ? true : false}
                    FormHelperTextProps={{
                      error: true
                    }}
                    helperText={showErrors(errors.email)}
                    required
                    fullWidth
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...password}
                    name='password'
                    type='password'
                    inputProps={{
                      'data-testid': 'register-input-password'
                    }}
                    label='Password'
                    InputLabelProps={{ required: false }}
                    error={errors.password ? true : false}
                    FormHelperTextProps={{
                      error: true
                    }}
                    helperText={showErrors(errors.password)}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...confirmPassword}
                    name='confirm_password'
                    type='password'
                    inputProps={{
                      'data-testid': 'register-input-password-confirm'
                    }}
                    label='Confirm your password'
                    InputLabelProps={{ required: false }}
                    error={errors.confirm_password ? true : false}
                    FormHelperTextProps={{
                      error: true
                    }}
                    helperText={showErrors(errors.confirm_password)}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                type='submit'
                disabled={isLoading}
                data-testid='register-button-submit'
                variant='contained'
                size='large'
                disableElevation
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </PageContainer>
    </>
  )
}

export default Register
