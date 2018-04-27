import React, { Component } from 'react'
import { Button, Input, Form, FormGroup, Label } from 'reactstrap'
import SearchResult from './SearchResult'
import _ from 'lodash'

export default class SearchInput extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            loading: false,
            ingredients: null,
            inputValue: null,
            results: null,
            selected: null
        }

        this.updateInput = _.debounce(this.updateInput, 100);
    }

    /*
     * Listens to KeyUp event from the input
     *
     * @param {object} e Event object
     */
    handleKeyUp(e)
    {
        let keyCode = e.keyCode
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
    handleKeyDown(e)
    {
        let keyCode = e.keyCode
        let carretPosition = e.target.selectionStart

        // Prevent submit on Enter key
        if (keyCode === 13) {
            e.preventDefault()
        }

        // Navigate the results with the keyboard
        if ([38, 40].includes(keyCode)) {
            this.navigateResults(keyCode)
        }

        // Remove added ingredients on Backspace key
        if (keyCode === 8 && carretPosition === 0 && this.state.ingredients !== null) {
            this.state.ingredients.splice((this.state.ingredients.length - 1))
        }
    }

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
                    this.setState({
                        results: null
                    })

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

        this.setState({
            ingredients: ingredients,
            results: null,
            inputValue: null,
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
            <div className="row">
                <div className="col-12">
                    <div className="d-flex flex-row flex-wrap">
                        { this.state.ingredients !== null &&
                            <div className="col-auto">
                                <p>
                                    { this.state.ingredients.map((ingredient, index) =>
                                        <span
                                            key={ index }
                                            className="badge badge-info"
                                        >
                                            { ingredient }
                                        </span>
                                    ) }
                                </p>
                            </div>
                        }
                        <div className="col">
                            <Form>
                                <FormGroup>
                                    <Input
                                        autoFocus
                                        placeholder="Tappez un ingrédient.."
                                        onKeyDown={ this.handleKeyDown.bind(this) }
                                        onKeyUp={ this.handleKeyUp.bind(this) }
                                    />
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                </div>
                { this.state.results !== null &&
                    <div className="col-12">
                        <ul>
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