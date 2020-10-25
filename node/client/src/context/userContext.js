import React, { useContext, useReducer } from 'react'
import jwt from 'jsonwebtoken'
import { UsersService } from '../services'
import { isSuccessResponse } from '../global/helpers'

const ACTION_TYPES = {
  request: 'REQUEST',
  success: 'SUCCESS',
  error: 'ERROR'
}

const DEFAULT_STATE = {
  status: ACTION_TYPES.request,
  user: {},
  loading: true,
  error: {}
}

const UserStateContext = React.createContext(DEFAULT_STATE)
const UserDispatchContext = React.createContext({})


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
        user
      }
    }
    case ACTION_TYPES.error: {
      return {
        ...DEFAULT_STATE,
        status: ACTION_TYPES.error,
        error: action.error
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useUserState = () => {
  const context = useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  return context
}

const useUserDispatch = () => {
  const context = useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context
}

const refresh = async (dispatch) => {
  dispatch({ type: ACTION_TYPES.request, loading: true })
  try {
    const payload = await UsersService.refresh()

    if (isSuccessResponse(payload)) {
      dispatch({ type: ACTION_TYPES.success, payload })
    } else {
      dispatch({ type: ACTION_TYPES.error, error: payload })
    }

    return setInterval(async () => {
      const payload = await UsersService.refresh()

      if (isSuccessResponse(payload)) {
        dispatch({ type: ACTION_TYPES.success, payload })
      } else {
        dispatch({ type: ACTION_TYPES.error, error: payload })
      }
    }, 300000)
  } catch (error) {
    dispatch({ type: ACTION_TYPES.error, error })
  }
}

const login = async (dispatch, data) => {
  dispatch({ type: ACTION_TYPES.request, loading: true })
  try {
    const payload = await UsersService.login(data)

    if (isSuccessResponse(payload)) {
      dispatch({ type: ACTION_TYPES.success, payload })
      return payload
    } else {
      throw payload
    }
  } catch (error) {
    dispatch({ type: ACTION_TYPES.error, error })
    return error
  }
}

const register = async (dispatch, data) => {
  dispatch({ type: ACTION_TYPES.request, loading: true })
  try {
    const payload = await UsersService.register(data)

    if (isSuccessResponse(payload)) {
      dispatch({ type: ACTION_TYPES.success, payload })
      return payload
    } else {
      throw payload
    }
  } catch (error) {
    dispatch({ type: ACTION_TYPES.error, error })
    return error
  }
}

const logout = async (dispatch) => {
  dispatch({ type: ACTION_TYPES.request, loading: true })
  try {
    const payload = await UsersService.logout()

    if (isSuccessResponse(payload)) {
      dispatch({ type: ACTION_TYPES.success, payload })
      return payload
    } else {
      throw payload
    }
  } catch (error) {
    dispatch({ type: ACTION_TYPES.error, error })
    return error
  }
}

const useUser = () => {
  return [useUserState(), useUserDispatch()]
}

const UserProvider = ({ children }) => {
  const [user, setUser] = useReducer(userReducer, DEFAULT_STATE)

  React.useEffect(() => {
    const interval = refresh(setUser)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

export { UserProvider, useUserState, useUserDispatch, useUser, login, logout, register }
