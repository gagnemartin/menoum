import { mockUsersServiceResponse } from '../../mocks/userMocks'

export default {
  refresh: jest.fn(),
  login: jest.fn(() => mockUsersServiceResponse.login.success),
  register: jest.fn(),
  logout: jest.fn()
}
