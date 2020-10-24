import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Home, NewRecipe, Login } from '../../pages'
import { UserProvider } from '../../context/userContext'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/recipe/new'>Add a Recipe</Link>
              </li>
              <li>
                <Link to='/login'>Login</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path='/recipe/new'>
              <NewRecipe />
            </Route>

            <Route path='/login'>
              <Login />
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
