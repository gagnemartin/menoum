import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import Logout from '../'
import { mockUsersServiceResponse } from '../../../mocks/userMocks'
import { UsersService } from '../../../services'

jest.mock('../../../hooks/useUser', () => ({
  useUserDispatch: () => jest.fn()
}))
jest.mock('../../../services/usersService')

describe('<Logout />', () => {
  it('should call logout()', async () => {
    UsersService.logout.mockReturnValueOnce(mockUsersServiceResponse.logout.success)
    const logout = jest.spyOn(UsersService, 'logout')
    const { queryByTestId } = render(
      <Router>
        <Logout />
      </Router>
    )

    userEvent.click(queryByTestId('nav-logout'))

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1)
    })
  })

  it('should return an error is API fails', async () => {
    UsersService.logout.mockReturnValueOnce(mockUsersServiceResponse.logout.error)
    const logout = jest.spyOn(UsersService, 'logout')
    const { queryByTestId } = render(
      <Router>
        <Logout />
      </Router>
    )

    userEvent.click(queryByTestId('nav-logout'))

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1)
    })
  })
})
