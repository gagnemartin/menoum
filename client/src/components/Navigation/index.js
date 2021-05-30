import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useUserState } from '../../hooks/useUser'
import { Dropdown, Flexbox, List } from '../Layout'
import Logout from '../Logout'

const style = {
  display: 'block',
  padding: '10px',
  color: 'inherit'
}

const NavLink = styled(Link)(style)
const NavItem = styled.div(style)

const Navigation = () => {
  const userState = useUserState()
  const { loading } = userState

  return (
    <nav>
      <Flexbox justifyContent='space-between'>
        <List.Ul listStyle='none' inline>
          <List.Item>
            <NavLink to='/' data-testid='nav-home'>
              Home
            </NavLink>
          </List.Item>
        </List.Ul>

        <List.Ul listStyle='none' inline>
          {!loading ? (
            Object.keys(userState.user).length === 0 ? (
              <>
                <List.Item>
                  <NavLink to='/login' data-testid='nav-login'>
                    Login
                  </NavLink>
                </List.Item>
                <List.Item>
                  <NavLink to='/register' data-testid='nav-register'>
                    Register
                  </NavLink>
                </List.Item>
              </>
            ) : (
              <List.Item>
                <Dropdown header={<span data-testid='nav-email'>{userState.user.email}</span>}>
                  <List.Ul listStyle='none'>
                    {userState.user.role === 'admin' && (
                      <List.Item>
                        <NavLink to='/recipe/new' data-testid='nav-new-recipe'>
                          Add a Recipe
                        </NavLink>
                      </List.Item>
                    )}
                    <List.Item>
                      <Logout />
                    </List.Item>
                  </List.Ul>
                </Dropdown>
              </List.Item>
            )
          ) : (
            <List.Item data-testid='nav-loading'>Loading</List.Item>
          )}
        </List.Ul>
      </Flexbox>
    </nav>
  )
}

export default Navigation
