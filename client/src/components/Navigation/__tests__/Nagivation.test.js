import { render, waitFor } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Navigation from '../'
import { UserProvider } from '../../../context/userContext'
import UsersService from '../../../services/usersService'
import { mockUsersServiceResponse } from '../../../mocks/userMocks'

const customRender = (children) => {
  return render(
    <UserProvider>
      <Router>{children}</Router>
    </UserProvider>
  )
}

jest.mock('../../../services/usersService')

describe('<Navigation />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should try to automatically login on page load', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.success)
    const refresh = jest.spyOn(UsersService, 'refresh')
    customRender(<Navigation />)

    await waitFor(() => {
      expect(refresh).toHaveBeenCalledTimes(1)
    })

    refresh.mockRestore()
  })

  it('should show show Loading during automatic login', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.success)
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
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.success)
    const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-email')
      expect(element).toBeInTheDocument()
    })
  })

  it('should throw an error after unsuccessfull automatic login', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.error)
    const { queryByTestId } = customRender(<Navigation />)

    await waitFor(() => {
      const element = queryByTestId('nav-login')
      expect(element).toBeInTheDocument()
    })
  })

  it('should not see admin section for normal user', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.success)
    const { queryByTestId } = customRender(<Navigation />)
    let elementEmail
    let element

    await waitFor(() => {
      elementEmail = queryByTestId('nav-email')
      expect(elementEmail).toBeInTheDocument()
    })

    userEvent.click(elementEmail)

    await waitFor(() => {
      element = queryByTestId('nav-new-recipe')
      expect(element).not.toBeInTheDocument()
    })
  })

  it('should see admin section for admin user', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.successAdmin)
    const { queryByTestId } = customRender(<Navigation />)
    let elementEmail
    let element

    await waitFor(() => {
      elementEmail = queryByTestId('nav-email')
      expect(elementEmail).toBeInTheDocument()
    })

    userEvent.click(elementEmail)

    await waitFor(() => {
      element = queryByTestId('nav-new-recipe')
      expect(element).toBeInTheDocument()
    })
  })
})
