import { useUserState } from './useUser'
import { actionTypes } from '../reducers/userReducer'

const useAccessControl = () => {
  const userPayload = useUserState()

  const isAuthenticated = () => {
    const { status } = userPayload

    return status === actionTypes.success
  }

  const isAuthorized = (role) => {
    const { status, user } = userPayload

    return status === actionTypes.success && user.role === role
  }

  return { isAuthenticated, isAuthorized }
}

export default useAccessControl
