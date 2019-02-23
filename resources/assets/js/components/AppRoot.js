import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import NavBar from './NavBar'
import Login from './User/Login'
import Register from './User/Register'
import Search from "./Search/Search"
import Ingredients from './Admin/Ingredients'
import Auth from './Auth/Auth'

class AppRoot extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            auth: this.resetAuth()
        }

        this.roles = [
            'admin',
            'moderator',
            'user',
            'guest'
        ]

        this.onLogin = this.onLogin.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.setUser = this.setUser.bind(this)
        this.resetAuth = this.resetAuth.bind(this)
    }

    componentDidMount()
    {
        Auth.getUser().then(response => {
            if (response.status !== 401 && 'id' in response) {
                this.setUser(response)
            }
        }).catch(thrown => {
            console.log(thrown.response)
        })
    }

    onLogin(data)
    {
        Auth.login(data)
            .then(response => {
                if (response.status !== 401 && 'id' in response) {
                    this.setUser(response)
                }
            })
    }

    setUser(user)
    {
        this.setState(prevState => ({
            auth: {
                ...prevState.auth,
                user: user,
                isAuthenticated: true
            }
        }))
    }

    onLogout()
    {
        Auth.logout()
            .then(() => {
                this.setState( {
                    auth: this.resetAuth()
                })
            })
    }

    resetAuth()
    {
        return {
            user: {},
            isAuthenticated: false,
            accessToken: null
        }
    }

    isAccessible(level)
    {
        return this.roles.indexOf(this.state.auth.user.role) >= this.roles.indexOf(level)
    }

    render()
    {
        const auth = this.state.auth

        return (
            <BrowserRouter>
                <div>
                    <NavBar onLogout={ this.onLogout } auth={ auth } />

                    <Switch>
                        <Route exact path="/" component={ Search } />
                        <Route path="/login" render={ () => <Login onSubmit={ this.onLogin } auth={ auth } /> } />
                        <Route path="/register" render={ () => <Register onSubmit={ this.onLogin } auth={ auth } /> } />
                        <PrivateRoute accessible={ this.isAccessible('admin') } path="/admin/ingredients" component={ Ingredients } auth={ auth } />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<AppRoot />, document.getElementById('app-root'))