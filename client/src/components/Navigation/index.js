import { Link } from 'react-router-dom'
import { useUserState } from '../../hooks/useUser'
import Logout from '../Logout'

const Navigation = () => {
  const userState = useUserState()
  const { loading } = userState

  return (
    <nav>
      <ul>
        <li>
          <Link to='/' data-testid='nav-home'>
            Home
          </Link>
        </li>

        {!loading ? (
          Object.keys(userState.user).length === 0 ? (
            <>
              <li>
                <Link to='/login' data-testid='nav-login'>
                  Login
                </Link>
              </li>
              <li>
                <Link to='/register' data-testid='nav-register'>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {userState.user.role === 'admin' && (
                <li>
                  <Link to='/recipe/new' data-testid='nav-new-recipe'>
                    Add a Recipe
                  </Link>
                </li>
              )}
              <li data-testid='nav-email'>{userState.user.email}</li>
              <li>
                <Logout />
              </li>
            </>
          )
        ) : (
          <li data-testid='nav-loading'>Loading</li>
        )}
      </ul>
    </nav>
  )
}

export default Navigation
