import React, { Component } from 'react'

export default class Highlighter extends Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        let parts = this.props.text.split(new RegExp(`(${this.props.highlight})`, 'gi'));

        return (
            <span>
                { parts.map((part, i) =>
                    <span key={i} style={part.toLowerCase() === this.props.highlight.toLowerCase() ? { fontWeight: 'bold' } : {} }>
                    { part }
                    </span>) }
            </span>
        )
    }
}