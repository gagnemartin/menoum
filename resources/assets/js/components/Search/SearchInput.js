import React, { Component } from 'react'
import { Button, Input, Form, FormGroup, Label } from 'reactstrap'
import SearchResult from './SearchResult'
import _ from 'lodash'

export default class SearchInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            ingredients: null,
            inputValue: null,
            results: null,
            selected: null
        }

        this.search = React.createRef()
        this.updateInput = _.debounce(this.updateInput, 100);
    }

    /*
     * Listens to KeyUp event from the input
     *
     * @param {object} e Event object
     */
    handleKeyUp(e) {
        let value = e.target.value.trim()

        // Set value to null if input is empty
        if (value === '') {
            value = null
        }

        this.setState({
            inputValue: value
        }, this.update)
    }

    /*
     * Listens to KeyDown event from the input
     *
     * @param {object} e Event object
     */
    handleKeyDown(e) {
        let keyCode = e.keyCode
        let carretPosition = e.target.selectionStart

        // Prevent submit on Enter key
        if (keyCode === 13) {
            e.preventDefault()

            // User pressed Enter key when navigating in the results with the keyboard
            if (this.state.selected !== null) {
                this.resultClick(this.state.results[this.state.selected].name)
            }
        }

        // Navigate the results with the keyboard
        if ([38, 40].includes(keyCode)) {
            this.navigateResults(keyCode)
        }

        // Remove added ingredients on Backspace key
        if (keyCode === 8 && carretPosition === 0 && this.state.ingredients !== null) {
            this.state.ingredients.splice((this.state.ingredients.length - 1))

            if (this.state.ingredients.length === 0) {
                this.setState({
                    ingredients: null
                })
            }
        }
    }

    handleChange(e)
    {
        let value = e.target.value.trim()

        // Set value to null if input is empty
        if (value === '') {
            value = null
        }

        this.setState({
            inputValue: value
        })
    }

    /*
     * Listens when the user loses the focus of the input
     */
    handleBlur()
    {
        this.emptyResults()
    }

    /*
     * Empties the results in the state
     */
    emptyResults()
    {
        this.setState({
            results: null
        })
    }

    /*
     * Nagivate through the result box with the keyboard
     *
     * @param {int} keyCode
     */
    navigateResults(keyCode)
    {
        if (this.state.results !== null) {
            let selected
            if (keyCode == 38) {
                if (this.state.selected === null) {
                    selected = this.state.results.length - 1
                } else {
                    if (typeof this.state.results[this.state.selected - 1] === 'undefined') {
                        selected = this.state.results.length - 1
                    } else {
                        selected = this.state.selected - 1
                    }
                }
            } else {
                if (this.state.selected === null) {
                    selected = 0
                } else {
                    if (typeof this.state.results[this.state.selected + 1] === 'undefined') {
                        selected = 0
                    } else {
                        selected = this.state.selected + 1
                    }
                }
            }

            this.setState({
                selected: selected
            })
        }
    }

    /*
     * Update some stuff
     */
    update()
    {
        this.updateInput()
        this.updateDropdown()
    }

    /*
     * Updates the dropdown with new data
     */
    updateDropdown()
    {
        if (this.state.results != null) {
            for (let i = this.state.results.length; i--;) {
                let split = this.state.results[i].name.split(this.state.inputValue)

                if (split.length <= 1) {
                    this.emptyResults()

                    break;
                }
            }
        }
    }

    /*
     * Requests the server to retrieve data from the input
     */
    updateInput()
    {
        let self = this
        let data = this.state.inputValue

        this.setState({
            loading: true
        })

        if (data !== null) {
            const $request = axios.get('/ingredient/' + data)
                .then(function (response) {
                    self.setState({
                        results: response.data,
                        loading: false
                    }, self.updateDropdown)
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    }

    /*
     * Detects when a user click on a result
     *
     * @param {object} data Object of the clicked element
     */
    resultClick(data)
    {
        let ingredients = this.state.ingredients

        if (ingredients === null) {
            ingredients = [data]
        } else {
            let isNotThere = true
            ingredients.map((ingredient) => {
                if (ingredient == data) {
                    isNotThere = false
                }
            })
            if (isNotThere) {
                ingredients.push(data)
            }
        }

        this.search.current.focus()

        this.setState({
            ingredients: ingredients,
            results: null,
            inputValue: '',
            selected: null
        }, this.getRecipes)
    }

    /*
     * Search recipes from the ingredients
     */
    getRecipes()
    {
        let data = {
            ingredients: this.state.ingredients
        }

        this.props.getRecipes(data)
    }

    /*
     * Render it all, baby!
     */
    render()
    {
        return (
            <div className="row position-relative">
                <div className="col-12">
                    <div className="search-wrap d-flex flex-row flex-wrap align-items-center px-3">
                        { this.state.ingredients !== null &&
                            <div className="mr-3">
                                { this.state.ingredients.map((ingredient, index) =>
                                    <span
                                        key={ index }
                                        className="badge badge-info"
                                    >
                                        { ingredient }
                                    </span>
                                ) }
                            </div>
                        }
                        <div className="col p-0">
                            <input
                                autoFocus
                                ref={ this.search }
                                placeholder="Search for an ingredient..."
                                onKeyDown={ this.handleKeyDown.bind(this) }
                                onKeyUp={ this.handleKeyUp.bind(this) }
                                onChange={ this.handleChange.bind(this) }
                                onBlur={ this.handleBlur.bind(this) }
                                className="input-search p-0"
                                value={ this.state.inputValue !== null ? this.state.inputValue : ''}
                            />
                        </div>
                    </div>
                </div>
                { this.state.results !== null &&
                    <div className="result-wrap px-3">
                        <ul className="list-ul">
                            {this.state.results.map((result, index) => (
                                <SearchResult
                                    key={ index }
                                    value={ result }
                                    inputValue={ this.state.inputValue }
                                    onClick={ this.resultClick.bind(this) }
                                    selected={ this.state.selected }
                                    className={ 'list-item' + (this.state.selected === index ? ' hover' : '') }
                                />
                            ))}
                        </ul>
                    </div>
                }
            </div>
        )
    }
}