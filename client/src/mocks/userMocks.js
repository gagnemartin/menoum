import jwt from 'jsonwebtoken'

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

const usersServiceResponseMocks = {
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

export { userAdminMock, userMock, usersServiceResponseMocks, userAdminToken, userToken }
