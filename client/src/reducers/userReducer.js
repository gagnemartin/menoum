import jwt from 'jsonwebtoken'

export const actionTypes = {
  request: 'REQUEST',
  success: 'SUCCESS',
  error: 'ERROR'
}

export const initialState = {
  status: actionTypes.request,
  user: {},
  loading: true,
  error: {}
}

const userReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.request: {
      return {
        ...initialState,
        status: actionTypes.request,
        user: state.user,
        loading: true
      }
    }
    case actionTypes.success: {
      let user = {}

      if (action.payload.data && action.payload.data.token) {
        const {
          data: { token, expires_at }
        } = action.payload

        user = {
          ...jwt.decode(token),
          token,
          expires_at
        }
      }

      return {
        ...initialState,
        status: actionTypes.success,
        loading: false,
        user
      }
    }
    case actionTypes.error: {
      return {
        ...initialState,
        status: actionTypes.error,
        loading: false,
        error: action.error
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export default userReducer
