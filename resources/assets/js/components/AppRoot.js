import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Search from "./Search/Search"
import Ingredients from './Admin/Ingredients'

if (document.getElementById('app-search')) {
    class AppRoot extends Component {
        render() {
            return (
                <Search />
            )
        }
    }

    ReactDOM.render(<AppRoot />, document.getElementById('app-search'))
}

else if (document.getElementById('app-admin-ingredients')) {
    class AppRoot extends Component {
        render() {
            return (
                <Ingredients />
            )
        }
    }

    ReactDOM.render(<AppRoot />, document.getElementById('app-admin-ingredients'))
}