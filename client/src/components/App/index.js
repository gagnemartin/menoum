import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home, NewRecipe, UpdateRecipe, Login, Register } from '../../pages'
import { UserProvider } from '../../context/userContext'
import { ProtectedRoute } from '../Protected'
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

            <ProtectedRoute role='admin' exact={true} path='/recipe/edit/:uuid'>
              <UpdateRecipe />
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

export default App
