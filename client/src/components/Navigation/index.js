import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { styled } from '@material-ui/system'
import { useUserState } from '../../hooks/useUser'
import Logout from '../Logout'

const NavLink = styled(Link)(({ theme }) => ({
  padding: theme.spacing(2)
}))

const Navigation = () => {
  const userState = useUserState()
  const { loading, user, status } = userState

  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <nav>
      <Box display='flex' alignItems='center' px={2}>
        <Box display='flex' flexGrow={1}>
          <NavLink component={RouterLink} to='/' data-testid='nav-home'>
            Menoum
          </NavLink>
        </Box>
        <Box display='flex'>
          {!loading ? (
            user?.email ? (
              <>
                <NavLink
                  ref={anchorRef}
                  component='button'
                  aria-controls='nav-main-menu'
                  aria-haspopup='true'
                  onClick={handleToggle}
                  data-testid='nav-email'
                >
                  <AccountCircleIcon color='disabled' sx={{ '&:hover': { color: 'black' } }} />
                </NavLink>

                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList autoFocusItem={open} id='nav-main-menu' onKeyDown={handleListKeyDown}>
                            {user.role === 'admin' && (
                              <MenuItem onClick={handleClose}>
                                <Link component={RouterLink} to='/recipe/new' data-testid='nav-new-recipe'>
                                  Add a Recipe
                                </Link>
                              </MenuItem>
                            )}
                            <MenuItem onClick={handleClose}>
                              <Logout />
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            ) : (
              <>
                <NavLink component={RouterLink} to='/login' data-testid='nav-login'>
                  Sign in
                </NavLink>
                <NavLink component={RouterLink} to='/register' data-testid='nav-register'>
                  Register
                </NavLink>
              </>
            )
          ) : (
            <p data-testid='nav-loading'>loading</p>
          )}
        </Box>
      </Box>
    </nav>
  )
}

export default Navigation
