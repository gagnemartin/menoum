import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Alert from '@material-ui/core/Alert'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { PageHeader, PageTitle, PageContainer } from '../../../components/Layout'
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
    <>
      <PageHeader>
        <PageTitle>Sign in to your account</PageTitle>
      </PageHeader>

      <PageContainer maxWidth='xs'>
        <form onSubmit={handleSubmit} action='#'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {hasError && (
                    <Alert severity='error' data-testid='login-error-message'>
                      {errorMessage}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...email}
                    name='email'
                    type='email'
                    inputProps={{
                      'data-testid': 'login-input-email'
                    }}
                    label='Email Address'
                    InputLabelProps={{ required: false }}
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
                      'data-testid': 'login-input-password'
                    }}
                    label='Password'
                    InputLabelProps={{ required: false }}
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
                data-testid='login-button-submit'
                variant='contained'
                size='large'
                disableElevation
                fullWidth
              >
                Sign in
              </Button>
            </Grid>
          </Grid>
        </form>
      </PageContainer>
    </>
  )
}

export default Login
