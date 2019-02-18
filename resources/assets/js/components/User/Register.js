import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'

export default class Register extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            username: null,
            email: null,
            password: null,
            password_confirmation: null
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e)
    {
        const key = e.target.name
        let value = e.target.value

        if (value.trim() === '') {
            value = null
        }

        this.setState({
            [key]: value
        })
    }

    onSubmit(e)
    {
        e.preventDefault()

        const data = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
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
                    <form className="form-basic user-register" method="POST" action="/api/register" onSubmit={ this.onSubmit }>
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

                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            onChange={ this.handleChange }
                            id="email"
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            required
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

                        <label htmlFor="passwordConfirmation" className="sr-only">Confirm your password</label>
                        <input
                            onChange={ this.handleChange }
                            type="password"
                            name="password_confirmation"
                            id="passwordConfirmation"
                            className="form-control"
                            placeholder="Confirm your password"
                            required
                        />

                        <button className="btn btn-lg btn-primary btn-block mb-2" type="submit">Register</button>
                        <Link to="/login" className="btn btn-lg btn-primary btn-block">Sign in</Link>
                        <Link to="/password-reset" className="btn btn-lg btn-primary btn-block">Forgot Your Password?</Link>
                    </form>
                </div>
        )
    }
}

Register.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

Register.defaultProps = {
    auth: {},
    onSubmit: () => {}
}