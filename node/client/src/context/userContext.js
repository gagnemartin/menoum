import React, { useContext, useReducer } from 'react'
import jwt from 'jsonwebtoken'
import { UsersService } from '../services'

const UserStateContext = React.createContext({})
const UserDispatchContext = React.createContext({})

const DEFAULT_STATE = {
  user: {},
  loading: false,
  error: {}
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST': {
      return { ...DEFAULT_STATE, user: {}, loading: true }
    }
    case 'SUCCESS': {
      const { token, expires_at } = action.payload
      const user = { ...jwt.decode(token), token, expires_at }

      return { ...DEFAULT_STATE, user, loading: false }
    }
    case 'ERROR': {
      return { error: action.data }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const UserProvider = ({ children }) => {
  const [user, setUser] = useReducer(userReducer, {})

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
  dispatch({ type: 'REQUEST', loading: true })
  try {
    const payload = await UsersService.refresh()

    dispatch({ type: 'SUCCESS', payload })

    return setInterval(async () => {
      const payload = await UsersService.refresh()
      dispatch({ type: 'SUCCESS', payload })
    }, 300000)
  } catch (error) {
    dispatch({ type: 'ERROR', error })
  }
}

const login = async (dispatch, data) => {
  dispatch({ type: 'REQUEST', loading: true })
  try {
    const payload = await UsersService.login(data)

    dispatch({ type: 'SUCCESS', payload })
  } catch (error) {
    dispatch({ type: 'ERROR', error })
  }
}

const useUser = () => {
  return [useUserState(), useUserDispatch()]
}

export { UserProvider, useUserState, useUserDispatch, login, useUser }
