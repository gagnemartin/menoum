import jwt from 'jsonwebtoken'

const mockUser = {
  email: 'test@test.com',
  password: 'test123',
  role: 'user'
}

const mockUserAdmin = {
  ...mockUser,
  role: 'admin'
}

const userToken = jwt.sign(mockUser, 'fakehash')
const userAdminToken = jwt.sign(mockUserAdmin, 'fakehash')

const mockUsersServiceResponse = {
  refresh: {
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
  },

  login: {
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
  },
  
  logout: {
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
  },

  register: {
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
      error: new Error('False Error'),
      data: {
        email: { minLength: 'Too short' }
      }
    }
  }
}

export { mockUserAdmin, mockUser, mockUsersServiceResponse, userAdminToken, userToken }
