import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import Register from '../Register'
import { mockUsersServiceResponse, mockUser } from '../../../mocks/userMocks'
import { register } from '../../../context/userContext'
import { UsersService } from '../../../services'

jest.mock('../../../hooks/useUser', () => ({
  useUserDispatch: () => jest.fn()
}))
jest.mock('../../../services/usersService')

const customRender = () => {
  return render(
    <Router initialEntries={['/register']}>
      <Switch>
        <Route path='/register'>
          <Register />
        </Route>

        <Route path='/'>
          <h1 data-testid='homepage'>Homepage</h1>
        </Route>
      </Switch>
    </Router>
  )
}

describe('<Register />', () => {
  it('should show error is user can not register', async () => {
    UsersService.register.mockReturnValueOnce(mockUsersServiceResponse.register.error)
    const { queryByTestId, queryAllByTestId } = customRender()

    const inputEmail = queryByTestId('register-input-email')
    const inputPassword = queryByTestId('register-input-password')
    const inputPasswordConfirm = queryByTestId('register-input-password-confirm')
    const buttonSubmit = queryByTestId('register-button-submit')

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)
    userEvent.type(inputPasswordConfirm, mockUser.password)
    userEvent.click(buttonSubmit)

    await waitFor(() => {
      const errors = queryAllByTestId('register-error-item')
      expect(errors.length).toBe(Object.keys(mockUsersServiceResponse.register.error.data).length)
    })
  })

  it('should redirect to homepage if no previous page is defined', async () => {
    UsersService.register.mockReturnValueOnce(mockUsersServiceResponse.register.success)
    const { queryByTestId } = customRender()

    const inputEmail = queryByTestId('register-input-email')
    const inputPassword = queryByTestId('register-input-password')
    const inputPasswordConfirm = queryByTestId('register-input-password-confirm')
    const buttonSubmit = queryByTestId('register-button-submit')

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)
    userEvent.type(inputPasswordConfirm, mockUser.password)
    userEvent.click(buttonSubmit)

    await waitFor(() => {
      const homepage = queryByTestId('homepage')
      expect(homepage).not.toBeInTheDocument()
    })
  })

  it('should redirect to previous page', async () => {
    UsersService.register.mockReturnValueOnce(mockUsersServiceResponse.register.success)
    // useLocation.mockImplementation(() => ({
    //   state: { from: '/test' }
    // }))
    const { queryByTestId } = customRender()

    const inputEmail = queryByTestId('register-input-email')
    const inputPassword = queryByTestId('register-input-password')
    const inputPasswordConfirm = queryByTestId('register-input-password-confirm')
    const buttonSubmit = queryByTestId('register-button-submit')

    userEvent.type(inputEmail, mockUser.email)
    userEvent.type(inputPassword, mockUser.password)
    userEvent.type(inputPasswordConfirm, mockUser.password)
    userEvent.click(buttonSubmit)

    await waitFor(() => {
      const homepage = queryByTestId('homepage')
      expect(homepage).not.toBeInTheDocument()
    })
  })
})
