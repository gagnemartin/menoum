import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../'
import UsersService from '../../../services/usersService'
import { usersServiceResponseMocks } from '../../../mocks/userMocks'

jest.mock('../../../services/usersService', () => ({
  refresh: jest.fn()
}))

describe('<App />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should render and match snapshot', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.success)
    const { asFragment } = render(<App />)

    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot()
    })
  })

  it('should navigate to admin section for admin user', async () => {
    UsersService.refresh.mockReturnValue(usersServiceResponseMocks.successAdmin)
    const { queryByTestId, queryByText } = render(<App />)

    await waitFor(() => {
      const element = queryByTestId('nav-new-recipe')
      userEvent.click(element)

      const title = queryByText(/New Recipe/)
      expect(title).toBeInTheDocument()
    })
  })
})
