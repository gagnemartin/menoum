import { useHistory } from 'react-router-dom'
import { logout } from '../../context/userContext'
import { useUserDispatch } from '../../hooks/useUser'

const Logout = () => {
  const history = useHistory()
  const dispatch = useUserDispatch()

  const handleClick = async (e) => {
    e.preventDefault()

    await logout(dispatch)
    history.replace('/')
  }

  return (
    <a onClick={handleClick} href='#' data-testid='nav-logout'>
      Logout
    </a>
  )
}

export default Logout
