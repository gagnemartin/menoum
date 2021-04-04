import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useUserState } from '../../hooks/useUser'
import Dropdown from '../Layout/Dropdown'
import Logout from '../Logout'

const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  padding: 0;

  li a {
    display: block;
    padding: 10px;
    color: inherit;
  }
`

const Navigation = () => {
  const userState = useUserState()
  const { loading } = userState

  return (
    <nav>
      <Ul>
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
            <li>
              <Dropdown header={<span data-testid='nav-email'>{userState.user.email}</span>}>
                <ul>
                  {userState.user.role === 'admin' && (
                    <li>
                      <Link to='/recipe/new' data-testid='nav-new-recipe'>
                        Add a Recipe
                      </Link>
                    </li>
                  )}
                  <li>
                    <Logout />
                  </li>
                </ul>
              </Dropdown>
            </li>
          )
        ) : (
          <li data-testid='nav-loading'>Loading</li>
        )}
      </Ul>
    </nav>
  )
}

export default Navigation
