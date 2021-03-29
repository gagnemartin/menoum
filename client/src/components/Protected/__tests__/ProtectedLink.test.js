import { render, waitFor } from '@testing-library/react'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import { ProtectedLink } from '../'
import UsersService from '../../../services/usersService'
import { mockUsersServiceResponse } from '../../../mocks/userMocks'
import { UserProvider } from '../../../context/userContext'

jest.mock('../../../services/usersService')

const renderAtPath = () => {
  return render(
    <UserProvider>
      <Router>
        <ProtectedLink to='/admin-link' role='admin' data-testid='admin-link'>
          Admin Link
        </ProtectedLink>

        <Switch>
          <Route path='/'>
            <h1 data-testid='homepage-route'>Homepage</h1>
          </Route>

          <Route path='/login'>
            <h1 data-testid='login-route'>Login</h1>
          </Route>
        </Switch>
      </Router>
    </UserProvider>
  )
}

describe('<ProtectedLink />', () => {
  it('should show the link if authorized', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.successAdmin)
    const { queryByTestId } = renderAtPath()

    await waitFor(() => {
      const element = queryByTestId('admin-link')
      expect(element).toBeInTheDocument()
    })
  })

  it('should not show the link if not authorized', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.success)
    const { queryByTestId } = renderAtPath()

    await waitFor(() => {
      const element = queryByTestId('admin-link')
      expect(element).not.toBeInTheDocument()
    })
  })
})
