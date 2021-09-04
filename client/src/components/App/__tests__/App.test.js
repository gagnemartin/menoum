import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../'
import UsersService from '../../../services/usersService'
import { mockUsersServiceResponse } from '../../../mocks/userMocks'

jest.mock('../../../services/usersService')

describe('<App />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it.skip('should render and match snapshot', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.success)
    const { asFragment } = render(<App />)

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('should navigate to admin section for admin user', async () => {
    UsersService.refresh.mockReturnValue(mockUsersServiceResponse.refresh.successAdmin)
    const { queryByTestId, queryByText } = render(<App />)
    let elementEmail
    let element

    await waitFor(() => {
      elementEmail = queryByTestId('nav-email')
      expect(elementEmail).toBeInTheDocument()
    })

    userEvent.click(elementEmail)

    await waitFor(() => {
      element = queryByTestId('nav-new-recipe')
    })

    userEvent.click(element)

    await waitFor(() => {
      const title = queryByText(/New Recipe/)
      expect(title).toBeInTheDocument()
    })
  })
})
