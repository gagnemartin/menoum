import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import Login from '../Login'
import { mockUsersServiceResponse, mockUser } from '../../../mocks/userMocks'
import { UsersService } from '../../../services'

jest.mock('../../../hooks/useUser', () => ({
  useUserDispatch: () => jest.fn()
}))
jest.mock('../../../services/usersService')

const customRender = () => {
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
  it('should show error if user can not login', async () => {
    UsersService.login.mockReturnValueOnce(mockUsersServiceResponse.login.error)
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
    UsersService.login.mockReturnValueOnce(mockUsersServiceResponse.login.success)
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
