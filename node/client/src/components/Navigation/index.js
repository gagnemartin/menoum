import React, { useState, useEffect } from 'react'
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
          <Link to='/'>Home</Link>
        </li>

        {!isLoading && Object.keys(userState.user).length === 0 ? (
          <>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/register'>Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/recipe/new'>Add a Recipe</Link>
            </li>
            <li>
              <p>{userState.user.email}</p>
            </li>
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
