import React, { Component } from 'react'
import SearchResult from "./SearchResult";

export default class SearchResults extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {}
    }

    render()
    {
        return (
            this.props.results.length > 0 &&
            <div className="result-wrap px-3">
                <ul className="list-ul">
                    { this.props.results.map((result, index) => (
                        <SearchResult
                            key={ index }
                            result={ result }
                            inputValue={ this.props.inputValue }
                            resultClick={ this.props.resultClick }
                            selected={ this.props.selected }
                            className={ 'list-item' + (this.props.selected === index ? ' hover' : '') }
                        />
                    ))}
                </ul>
            </div>
        )
    }
}