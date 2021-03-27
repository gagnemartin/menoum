import jwt from 'jsonwebtoken'

export const ACTION_TYPES = {
  request: 'REQUEST',
  success: 'SUCCESS',
  error: 'ERROR'
}

export const DEFAULT_STATE = {
  status: ACTION_TYPES.request,
  user: {},
  loading: true,
  error: {}
}

const userReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.request: {
      return {
        ...DEFAULT_STATE,
        status: ACTION_TYPES.request,
        user: state.user,
        loading: true
      }
    }
    case ACTION_TYPES.success: {
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
        ...DEFAULT_STATE,
        status: ACTION_TYPES.success,
        loading: false,
        user
      }
    }
    case ACTION_TYPES.error: {
      return {
        ...DEFAULT_STATE,
        status: ACTION_TYPES.error,
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
