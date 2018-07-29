import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Search from "./Search/Search"

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