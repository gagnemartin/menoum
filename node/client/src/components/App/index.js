import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home, NewRecipe, Login, Register } from '../../pages'
import { UserProvider } from '../../context/userContext'
import ProtectedRoute from './ProtectedRoute'
import Navigation from '../Navigation'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div>
          <Navigation />

          <Switch>
            <ProtectedRoute role='admin' exact={true} path='/recipe/new'>
              <NewRecipe />
            </ProtectedRoute>

            <Route path='/login'>
              <Login />
            </Route>

            <Route path='/register'>
              <Register />
            </Route>

            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App;
