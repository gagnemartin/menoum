import { render, waitFor } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import Navigation from '../'
import { UserProvider } from '../../../context/userContext'
import UsersService from '../../../services/usersService'
import { usersServiceResponseMocks } from '../../../mocks/userMocks'

const customRender = (children) => {
  return render(
    <UserProvider>
      <Router>{children}</Router>
    </UserProvider>
  )
}

jest.mock('../../../services/usersService', () => ({
  refresh: jest.fn()
}))

describe('<Navigation />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should try to automatically login on page load', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const refresh = jest.spyOn(UsersService, 'refresh')
    customRender(<Navigation />)

    await waitFor(() => {
      expect(refresh).toHaveBeenCalledTimes(1)
    })

    refresh.mockRestore()
  })

  it('should show show Loading during automatic login', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-loading')
      expect(element).toBeInTheDocument()
    })

    await waitFor(() => {
      const element = queryByTestId('nav-loading')
      expect(element).not.toBeInTheDocument()
    })
  })

  it('should show email on page load after successfull automatic login', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-email')
      expect(element).toBeInTheDocument()
    })
  })

  it('should throw an error after unsuccessfull automatic login', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.error)
    const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-login')
      expect(element).toBeInTheDocument()
    })
  })

  it('should not see admin section for normal user', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-new-recipe')
      expect(element).not.toBeInTheDocument()

      const elementEmail = queryByTestId('nav-email')
      expect(elementEmail).toBeInTheDocument()
    })
  })

  it('should see admin section for admin user', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.successAdmin)
      const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-new-recipe')
      expect(element).toBeInTheDocument()
    })
  })
})
