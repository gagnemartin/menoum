import React, { Component } from 'react'
import SearchInput from './SearchInput'
import Recipes from "./Recipes"

export default class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ingredients: [],
            recipes: []
        }
    }

    getRecipes(data)
    {
        if (data.ingredients.length > 0) {
            this.setState({
                loading: true
            })

            let self = this
            const $request = axios.get('/recipe', {
                params: data
            })
                .then(response => {
                    self.setState({
                        recipes: response.data,
                        loading: false
                    })
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.setState({
                recipes: [],
            })
        }
    }

    render()
    {
        return (
            <div className="container">
                <h1 className="text-center my-5">Menoum</h1>
                <SearchInput
                    getRecipes={ this.getRecipes.bind(this) }
                />

                <Recipes
                    recipes={ this.state.recipes}
                />
            </div>
        );
    }
}