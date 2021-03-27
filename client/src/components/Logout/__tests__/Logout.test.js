import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import Logout from '../'
import * as userContext from '../../../context/userContext'

jest.mock('../../../context/userContext', () => ({
  logout: jest.fn(),
  useUserDispatch: jest.fn()
}))

describe('<Logout />', () => {
  it('should call logout()', async () => {
    const logout = jest.spyOn(userContext, 'logout')
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
