import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useUserState } from '../../context/userContext'
import Logout from '../Logout'

const Navigation = () => {
  const userState = useUserState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userState.status !== 'REQUEST') {
      setIsLoading(false)
    }
  }, [userState])

  return (
    <nav>
      <ul>
        <li>
          <Link to='/' data-testid='nav-home'>
            Home
          </Link>
        </li>

        {!isLoading && Object.keys(userState.user).length === 0 ? (
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
        )}
      </ul>
    </nav>
  )
}

export default Navigation
