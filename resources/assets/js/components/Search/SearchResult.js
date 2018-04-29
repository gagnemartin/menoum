import React, { Component } from 'react'
import Highlighter from '../Tools/Highlighter'

export default class SearchResult extends Component
{
    constructor(props)
    {
        super(props)
    }

    /*
     * Handle the click on and element
     *
     * @param {object} e The event
     */
    handleClick(e)
    {
        this.props.onClick(this.props.value.name)
    }

    /*
     * Render it all, baby!
     */
    render()
    {
        return (
            <li
                onMouseDown={ this.handleClick.bind(this) }
                className={ this.props.className }
            >
                { this.props.inputValue !== null &&
                <Highlighter
                    text={ this.props.value.name }
                    highlight={ this.props.inputValue }
                />
                }
            </li>
        )
    }
}