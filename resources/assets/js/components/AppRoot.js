import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import NavBar from './NavBar'
import Login from './User/Login'
import Search from "./Search/Search"
import Ingredients from './Admin/Ingredients'
import Auth from './Auth'

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
    }
    componentDidMount()
    {
        // TODO Login the user on page refresh
        // Auth.getUser().then(response => {
        //     const user = response.id
        //
        //     console.log(response, user)
        // })
    }

    onLogin(data)
    {
        Auth.login(data)
            .then(response => {
                if (response.status !== 401 && 'id' in response) {
                    this.setState(prevState => ({
                        auth: { ...prevState.auth, user: response, isAuthenticated: true }
                    }))
                }
            })
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
        console.log(auth)

        return (
            <BrowserRouter>
                <div>
                    <NavBar onLogout={ this.onLogout } auth={ auth } />

                    <Switch>
                        <Route exact path="/" component={ Search } />
                        <Route path="/login" render={ () => <Login onSubmit={ this.onLogin } auth={ auth } /> } />
                        <PrivateRoute accessible={ this.isAccessible('admin') } path="/ingredients" component={ Ingredients } auth={ auth } />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<AppRoot />, document.getElementById('app-root'))