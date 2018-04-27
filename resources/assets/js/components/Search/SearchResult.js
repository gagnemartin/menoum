import React, { Component } from 'react'

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
        e.stopPropagation()
        this.props.onClick(e.target.dataset.name)
    }

    /*
     * Render it all, baby!
     */
    render()
    {
        let split = this.props.value.name.split(this.props.inputValue)

        return (
            <li
                onMouseDown={ this.handleClick.bind(this) }
                data-name={ this.props.value.name }
                className={ this.props.className }
            >
                {split.length > 1 &&
                    <b onMouseDown={ this.handleClick.bind(this) } data-name={ this.props.value.name }>{ this.props.inputValue }</b>
                }

                {split.length > 1 ? (
                    split[1]
                ) : (
                    this.props.value.name
                )}
            </li>
        )
    }
}