import { render, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import Navigation from '../'
import { UserProvider } from '../../../context/userContext'
import UsersService from '../../../services/usersService'

const userMock = {
  email: 'test@test.com',
  role: 'user'
}

const userAdminMock = {
  ...userMock,
  role: 'admin'
}

const userToken = jwt.sign(userMock, 'fakehash')
const userAdminToken = jwt.sign(userAdminMock, 'fakehash')

/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
const customRender = (children) => {
  return render(
    <UserProvider>
      <Router>{children}</Router>
    </UserProvider>
  )
}

const usersServiceMocks = {
  success: {
    status: 'success',
    data: {
      token: userToken
    }
  },
  successAdmin: {
    status: 'success',
    data: {
      token: userAdminToken
    }
  },
  error: {
    status: 'error',
    error: new Error('False Error')
  }
}

jest.mock('../../../services/usersService', () => ({
  refresh: jest.fn()
}))

describe('<Navigation />', () => {
  it('should try to automatically login on page load', async () => {
    UsersService.refresh.mockReturnValue(usersServiceMocks.success)
    const refresh = jest.spyOn(UsersService, 'refresh')
    const { unmount } = customRender(<Navigation />)

    await waitFor(() => {
      expect(refresh).toHaveBeenCalledTimes(1)
    })

    refresh.mockRestore()
    unmount()
  })

  it('should show show Loading during automatic login', async () => {
    UsersService.refresh.mockReturnValue(usersServiceMocks.success)
    const { queryByTestId, unmount } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-loading')
      expect(element).toBeInTheDocument()
    })

    unmount()
  })   

  it('should show email on page load after successfull automatic login', async () => {
    UsersService.refresh.mockReturnValue(usersServiceMocks.success)
    const { queryByTestId, unmount } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-email')
      expect(element).toBeInTheDocument()
    })

    unmount()
  })      
  
  it('should throw an error after unsuccessfull automatic login', async () => {
    UsersService.refresh.mockReturnValue(usersServiceMocks.error)
    const { queryByTestId, unmount } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-login')
      expect(element).toBeInTheDocument()
    })

    unmount()
  })      
  
  it('should not see admin section for normal user', async () => {
    UsersService.refresh.mockReturnValue(usersServiceMocks.success)
    const { queryByTestId, unmount } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-new-recipe')
      expect(element).not.toBeInTheDocument()

      const elementEmail = queryByTestId('nav-email')
      expect(elementEmail).toBeInTheDocument()
    })

    unmount()
  })      
  
  
it('should see admin section for admin user', async () => {
    UsersService.refresh.mockReturnValue(usersServiceMocks.successAdmin)
    const { queryByTestId, unmount } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-new-recipe')
      expect(element).toBeInTheDocument()
    })

    unmount()
  })      
})
