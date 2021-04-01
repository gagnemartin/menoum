import { createContext, useEffect, useReducer } from 'react'
import { UsersService } from '../services'
import { isSuccessResponse } from '../global/helpers'
import userReducer, { actionTypes, initialState } from '../reducers/userReducer'

const UserStateContext = createContext(initialState)
const UserDispatchContext = createContext({})

const refresh = async (dispatch) => {
  dispatch({ type: actionTypes.request, loading: true })
  try {
    const payload = await UsersService.refresh()

    if (isSuccessResponse(payload)) {
      dispatch({ type: actionTypes.success, payload })
    } else {
      dispatch({ type: actionTypes.error, error: payload })
    }

    return setInterval(async () => {
      const payload = await UsersService.refresh()

      if (isSuccessResponse(payload)) {
        dispatch({ type: actionTypes.success, payload })
      } else {
        dispatch({ type: actionTypes.error, error: payload })
      }
    }, 840000)
  } catch (error) {
    dispatch({ type: actionTypes.error, error })
  }
}

const login = async (dispatch, data) => {
  dispatch({ type: actionTypes.request, loading: true })
  try {
    const payload = await UsersService.login(data)

    if (isSuccessResponse(payload)) {
      dispatch({ type: actionTypes.success, payload })
      return payload
    } else {
      throw payload
    }
  } catch (error) {
    dispatch({ type: actionTypes.error, error })
    return error
  }
}

const register = async (dispatch, data) => {
  dispatch({ type: actionTypes.request, loading: true })
  try {
    const payload = await UsersService.register(data)

    if (isSuccessResponse(payload)) {
      dispatch({ type: actionTypes.success, payload })
      return payload
    } else {
      throw payload
    }
  } catch (error) {
    dispatch({ type: actionTypes.error, error })
    return error
  }
}

const logout = async (dispatch) => {
  dispatch({ type: actionTypes.request, loading: true })
  try {
    const payload = await UsersService.logout()

    if (isSuccessResponse(payload)) {
      console.log('SUCCESS', payload)
      dispatch({ type: actionTypes.success, payload })
      return payload
    } else {
      throw payload
    }
  } catch (error) {
    dispatch({ type: actionTypes.error, error })
    return error
  }
}

const UserProvider = ({ children }) => {
  const [user, setUser] = useReducer(userReducer, initialState)

  useEffect(() => {
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

export { UserProvider, UserStateContext, UserDispatchContext, login, logout, register }
