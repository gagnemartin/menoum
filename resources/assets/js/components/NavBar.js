import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { DropdownItem, DropdownMenu, DropdownToggle, Navbar, UncontrolledDropdown } from 'reactstrap'

export default class NavBar extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {}

        this.logout = this.logout.bind(this)
    }

    logout(e)
    {
        e.preventDefault()

        this.props.onLogout()
    }

    render()
    {
        const auth = this.props.auth

        return (
            <Navbar light expand="md">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                        data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"> </span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">

                    <ul className="nav navbar-nav">
                        <Link to="/" className="navbar-brand">Menoum</Link>
                    </ul>
                    <ul className="nav navbar-nav ml-auto">
                        { auth.isAuthenticated && auth.user.role === 'admin' &&
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Admin
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    <Link to="/admin/ingredients" className="nav-link">Ingredients</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        }
                        <li className="nav-item">
                            { auth.isAuthenticated ?

                                <a className="nav-link" href="/logout" onClick={ this.logout }>Logout</a>
                                :
                                <Link to="/login" className="nav-link">Login</Link>
                            }
                        </li>
                    </ul>
                </div>
            </Navbar>
        )
    }
}

NavBar.propTypes = {
    onLogout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}