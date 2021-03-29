import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router, Switch, Route, useLocation } from 'react-router-dom'
import Login from '../Login'
import { mockUsersServiceResponse, mockUser } from '../../../mocks/userMocks'
import { login } from '../../../context/userContext'

jest.mock('../../../context/userContext', () => ({
  login: jest.fn()
}))
jest.mock('../../../hooks/useUser', () => ({
  useUserDispatch: jest.fn()
}))

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useLocation: () => ({
//     state: { from: { pathname: '/est' } }
//   })
// }))

const customRender = (children) => {
  return render(
    <Router initialEntries={['/login']}>
      <Switch>
        <Route path='/login'>
          <Login />
        </Route>

        <Route path='/'>
          <h1 data-testid='homepage'>Homepage</h1>
        </Route>
      </Switch>
    </Router>
  )
}

describe('<Login />', () => {
  it('should update the state when te user types', async () => {
    const { queryByTestId } = customRender(<Login />)

    const inputEmail = queryByTestId('login-input-email')
    const inputPassword = queryByTestId('login-input-password')

    expect(inputEmail).toBeInTheDocument()
    expect(inputPassword).toBeInTheDocument()

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)

    await waitFor(() => {
      expect(inputEmail.value).toBe(mockUser.email)
      expect(inputPassword.value).toBe(mockUser.password)
    })
  })

  it('should show error is user can not login', async () => {
    login.mockReturnValueOnce(mockUsersServiceResponse.login.error)
    const { queryByTestId } = customRender(<Login />)

    const inputEmail = queryByTestId('login-input-email')
    const inputPassword = queryByTestId('login-input-password')
    const buttonSubmit = queryByTestId('login-button-submit')

    expect(inputEmail).toBeInTheDocument()
    expect(inputPassword).toBeInTheDocument()

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)
    userEvent.click(buttonSubmit)

    await waitFor(() => {
      const errorMessage = queryByTestId('login-error-message')
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('should redirect to homepage if no previous page is defined', async () => {
    const { queryByTestId } = customRender(<Login />)

    const inputEmail = queryByTestId('login-input-email')
    const inputPassword = queryByTestId('login-input-password')
    const buttonSubmit = queryByTestId('login-button-submit')

    expect(inputEmail).toBeInTheDocument()
    expect(inputPassword).toBeInTheDocument()

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)
    userEvent.click(buttonSubmit)

    await waitFor(() => {
      const homepage = queryByTestId('homepage')
      expect(homepage).not.toBeInTheDocument()
    })
  })

  it('should redirect to previous page', async () => {
    // useLocation.mockImplementation(() => ({
    //   state: { from: '/test' }
    // }))
    const { queryByTestId } = customRender(<Login />)

    const inputEmail = queryByTestId('login-input-email')
    const inputPassword = queryByTestId('login-input-password')
    const buttonSubmit = queryByTestId('login-button-submit')

    expect(inputEmail).toBeInTheDocument()
    expect(inputPassword).toBeInTheDocument()

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)
    userEvent.click(buttonSubmit)

    await waitFor(() => {
      const homepage = queryByTestId('homepage')
      expect(homepage).not.toBeInTheDocument()
    })
  })
})
