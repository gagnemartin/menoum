import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from "react-router-dom"

export default function PrivateRoute({ component: Component, ...rest }) {
    console.log(rest)
    return (
        <Route
            { ...rest }
            render={ props =>
                rest.auth.isAuthenticated ?
                    rest.accessible ?
                        <Component {...props} />
                        :
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: props.location }
                            }}
                        />
                    :
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />

            }
        />
    )
}

PrivateRoute.propTypes = {
    path: PropTypes.string.isRequired,
    accessible: PropTypes.bool,
}