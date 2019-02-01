import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Auth from '../Auth'
import PropTypes from 'prop-types'

export default class Login extends Component {
    constructor(props)
    {
        super(props)

        this.state = {
            username: null,
            password: null,
            remember: false,
            isAuthenticated: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleChange(e)
    {
        const key = e.target.name
        const value = e.target.value

        if (['username', 'password', 'remember'].includes(key)) {
            this.setState({
                [key]: value
            })
        }

    }

    onSubmit(e)
    {
        e.preventDefault()

        const data = {
            username: this.state.username,
            password: this.state.password,
            remember: this.state.remember
        }

        this.props.onSubmit(data)
    }

    render()
    {
        const auth = this.props.auth

        return (
            auth.isAuthenticated ? <Redirect to="/" />
            :
            <div className="container">
                <form className="form-basic" method="POST" action="/login" onSubmit={ this.onSubmit }>
                    <h1 className="h3 mb-3 font-weight-normal">Login</h1>

                    <label htmlFor="username" className="sr-only">Username</label>
                    <input
                        onChange={ this.handleChange }
                        id="username"
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Username"
                        required
                        autoFocus
                    />

                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        onChange={ this.handleChange }
                        type="password"
                        name="password"
                        id="password"
                        className="form-control"
                        placeholder="Password"
                        required
                    />

                        <div className="checkbox mb-3">
                            <label>
                                <input type="checkbox" name="remember" onChange={ this.handleChange } /> Remember Me
                            </label>
                        </div>

                        <button className="btn btn-lg btn-primary btn-block mb-2" type="submit">Sign in</button>
                        <Link to="/register" className="btn btn-lg btn-primary btn-block">Register</Link>
                        <Link to="/password-reset" className="btn btn-lg btn-primary btn-block">Forgot Your Password?</Link>
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}