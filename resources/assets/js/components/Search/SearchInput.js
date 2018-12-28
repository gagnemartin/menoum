import React, { Component } from 'react'
import SearchResults from "./SearchResults";
//import _ from 'lodash'

export default class SearchInput extends Component {
    constructor(props)
    {
        super(props)

        this.state = {
            loading: false,
            ingredients: [],
            allIngredients: [],
            inputValue: null,
            results: [],
            selected: null
        }

        this.search = React.createRef()
        //this.updateInput = _.debounce(this.updateInput, 100);
    }

    componentDidMount()
    {
        this.getIngredients()
    }

    /*
     * Get all the ingredients in an array
     */
    getIngredients()
    {
        this.setState({
            loading: true
        })

        const $request = axios.get('/api/ingredients')
            .then((response) => {
                this.setState({
                    allIngredients: response.data,
                    loading: false
                })
            })
            .catch((error) => {
                console.error(error)
            })
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
        }, () => {
            // Don't fetch new results on arrow keys
            if (![37, 38, 39, 40].includes(keyCode)) {
                this.update()
            }
        })
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

            // User pressed Enter key when navigating in the results with the keyboard
            if (this.state.selected !== null) {
                this.resultClick(this.state.results[this.state.selected])
            }
        }

        // Navigate the results with the keyboard
        if ([38, 40].includes(keyCode)) {
            this.navigateResults(keyCode)
        }

        // Remove added ingredients on Backspace key
        if (keyCode === 8 && carretPosition === 0 && this.state.ingredients.length > 0) {
            this.updateResults()
        }
    }

    handleChange(e)
    {
        let keyCode = e.keyCode
        let value = e.target.value.trim()

        // Set value to null if input is empty
        if (value === '') {
            value = null
        }

        this.setState({
            inputValue: value
        }, () => {
            // Don't fetch new results on arrow keys
            if (![37, 38, 39, 40].includes(keyCode)) {
                this.update()
            }
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
            results: []
        })
    }

    /*
     * Nagivate through the result box with the keyboard
     *
     * @param {int} keyCode
     */
    navigateResults(keyCode)
    {
        if (this.state.results.length > 0) {
            let selected

            if (keyCode === 38) {
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
       let t0 = performance.now();

        this.updateInput()

        let t1 = performance.now();
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    }

    updateResults()
    {
        let ingredients = this.state.ingredients
        ingredients.splice(ingredients.length - 1)

        let newState = {
            ingredients: ingredients
        }


        if (newState.ingredients.length === 0) {
            newState.ingredients = []
        }

        this.setState(newState, this.getRecipes)
    }

    /*
     * Search the ingredients array to retrieve data from the input
     */
    updateInput()
    {
        if (this.state.inputValue !== null) {
            let query = this.state.inputValue.replace(/[^a-zA-Z0-9_\- ]/g, "")
            let queries = [
                '^' + query,
                query

            ]
            let results = []

            for (let i = 0; i < queries.length; i++) {
                let query = queries[i]
                let regex = new RegExp((query), 'i')
                let search = this.state.allIngredients

                for (let i = 0; i < search.length; i++) {
                    let ingredient = search[i]
                    let matches = ingredient.name.match(regex)
                    if (matches !== null) {
                        let isAlreadyActive = this.state.ingredients.find(activeIngredient => {
                            return activeIngredient.name === matches.input
                        })

                        let isAlreadyInResults = results.find(activeIngredient => {
                            return activeIngredient.name === matches.input
                        })

                        if (typeof isAlreadyActive === 'undefined' && typeof isAlreadyInResults === 'undefined') {
                            results.push(ingredient)
                        }
                    }

                    if (results.length >= 10) break
                }

                if (results.length >= 10) break
            }

            this.setState({
                results: results,
            })
        } else {
            this.emptyResults()
        }
    }

    /*
     * Find a specific ingredient in the array from a complete name
     */
    findIngredient(data)
    {
        return this.state.allIngredients.find(ingredient => ingredient.id === data.id)
    }

    /*
     * Detects when a user click on a result
     *
     * @param {object} data Object of the clicked element
     */
    resultClick(data)
    {
        const ingredient = this.findIngredient(data)

        this.search.current.focus()

        this.setState(prevState => ({
            ingredients: [...prevState.ingredients, ingredient],
            results: [],
            inputValue: '',
            selected: null
        }), this.getRecipes)
    }

    /*
     * Search recipes from the ingredients
     */
    getRecipes()
    {
        const ingredient_ids = this.state.ingredients.map(ingredient => {
            return ingredient.id
        })
        const data = {
            ingredients: ingredient_ids
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
                        { this.state.ingredients.length > 0 &&
                            <div className="mr-3">
                                { this.state.ingredients.map((ingredient, index) =>
                                    <span
                                        key={ index }
                                        className="badge badge-info"
                                    >
                                        { ingredient.name }
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
                                //onKeyUp={ this.handleKeyUp.bind(this) }
                                onChange={ this.handleChange.bind(this) }
                                onBlur={ this.handleBlur.bind(this) }
                                className="input-search p-0"
                                value={ this.state.inputValue !== null ? this.state.inputValue : ''}
                            />
                        </div>
                    </div>
                </div>
                <SearchResults
                    results={ this.state.results }
                    inputValue={ this.state.inputValue }
                    resultClick={ this.resultClick.bind(this) }
                    selected={ this.state.selected }
                />
            </div>
        )
    }
}