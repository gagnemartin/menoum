import { render, waitFor } from '@testing-library/react'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import { ProtectedRoute } from '../'
import UsersService from '../../../services/usersService'
import { usersServiceResponseMocks } from '../../../mocks/userMocks'
import { UserProvider } from '../../../context/userContext'

jest.mock('../../../services/usersService', () => ({
  refresh: jest.fn()
}))

const renderAtPath = (path) => {
  return render(
    <UserProvider>
      <Router initialEntries={[path]}>
        <Switch>
          <ProtectedRoute role='admin' exact={true} path='/admin-route'>
            <h1 data-testid='admin-route'>Admin Route</h1>
          </ProtectedRoute>

          <ProtectedRoute role='user' exact={true} path='/user-route'>
            <h1 data-testid='user-route'>User Route</h1>
          </ProtectedRoute>

          <ProtectedRoute
            role='user'
            exact={true}
            path='/component-route'
            component={() => <h1 data-testid='component-route'>Component Route</h1>}
          />

          <Route path='/login'>
            <h1 data-testid='login-route'>Login Route</h1>
          </Route>

          <Route path='/'>
            <h1 data-testid='homepage-route'></h1>
          </Route>
        </Switch>
      </Router>
    </UserProvider>
  )
}

describe('<ProtectedRoute />', () => {
  it('should be redirected to homepage if not authorized', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const { queryByTestId } = renderAtPath('/admin-route')

    await waitFor(() => {
      const element = queryByTestId('homepage-route')
      expect(element).toBeInTheDocument()
    })
  })

  it('should be redirected to login if not authenticated', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.error)
    const { queryByTestId } = renderAtPath('/user-route')

    await waitFor(() => {
      const element = queryByTestId('login-route')
      expect(element).toBeInTheDocument()
    })
  })

  it('should render from component prop if defined', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const { queryByTestId } = renderAtPath('/component-route')

    await waitFor(() => {
      const element = queryByTestId('component-route')
      expect(element).toBeInTheDocument()
    })
  })
})
