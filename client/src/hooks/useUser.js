import { useContext } from 'react'
import { UserStateContext, UserDispatchContext } from '../context/userContext'

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

const useUser = () => {
  const userState = useUserState()
  const dispatch = useUserDispatch()

  return [userState, dispatch]
}

export { useUserState, useUserDispatch }
export default useUser
