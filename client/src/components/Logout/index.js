import { useHistory } from 'react-router-dom'
import Link from '@mui/material/Link'
import { isSuccessResponse } from '../../global/helpers'
import { useUserDispatch } from '../../hooks/useUser'
import { actionTypes } from '../../reducers/userReducer'
import { UsersService } from '../../services'

const Logout = () => {
  const history = useHistory()
  const dispatch = useUserDispatch()

  const logout = async () => {
    dispatch({ type: actionTypes.request, loading: true })
    try {
      const payload = await UsersService.logout()

      if (isSuccessResponse(payload)) {
        dispatch({ type: actionTypes.success, payload })
        history.replace('/')
      } else {
        throw payload
      }
    } catch (error) {
      dispatch({ type: actionTypes.error, error })
      return error
    }
  }

  const handleClick = async (e) => {
    e.preventDefault()

    await logout()
  }

  return (
    <Link href='/logout' onClick={handleClick} data-testid='nav-logout'>
      Logout
    </Link>
  )
}

export default Logout
