import React, { Component } from 'react'
import SearchInput from './SearchInput'
import Recipes from "./Recipes"

export default class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ingredients: [],
            recipes: [],
            requestTime: 0
        }
    }

    getRecipes(data)
    {
        if (data.ingredients.length > 0) {
            this.setState({
                loading: true,
                requestTime: 0
            })

            const timeStart = performance.now();

            console.log(data)
            const $request = axios.get('/api/recipe', {
                params: data
            })
                .then(response => {
                    const timeEnd = performance.now();

                    this.setState({
                        recipes: response.data,
                        loading: false,
                        requestTime: Math.floor(timeEnd - timeStart)
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
        const recipesLength = this.state.recipes.length
        const requestTime = this.state.requestTime / 1000

        return (
            <div className="container">
                <h1 className="text-center my-5">Menoum</h1>
                <SearchInput
                    getRecipes={ this.getRecipes.bind(this) }
                />

                { requestTime > 0 &&
                    <p className="small text-right mt-1 text-secondary">{ recipesLength } recipe{ recipesLength >= 2 ? 's' : '' } found in { requestTime } seconds.</p>
                }

                <Recipes
                    recipes={ this.state.recipes }
                />
            </div>
        );
    }
}