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
        this.props.resultClick(this.props.result)
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
                    data={ this.props.result }
                    text={ this.props.result.name }
                    highlight={ this.props.inputValue }
                />
                }
            </li>
        )
    }
}