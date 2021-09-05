import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useUserState } from '../../hooks/useUser'
import useAccessControl from '../../hooks/useAccessControl'
import { actionTypes } from '../../reducers/userReducer'

const ProtectedLink = (props) => {
  const userData = useUserState()
  const { isAuthorized, isAuthenticated } = useAccessControl()
  const { children, role } = props
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userData.status === actionTypes.request) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [userData])

  if (isLoading) return null

  if (isAuthenticated() && isAuthorized(role)) {
    return (
      <Link component={RouterLink} {...props}>
        {children}
      </Link>
    )
  }

  return null
}

ProtectedLink.propTypes = {
  to: PropTypes.string.isRequired,
  role: PropTypes.string
}

ProtectedLink.defaultProps = {
  role: 'user'
}

export default ProtectedLink
