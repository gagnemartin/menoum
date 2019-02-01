import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

export default class Ingredients extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            loading: false,
            ingredients: []
        }
    }

    componentDidMount()
    {
        this.fetchIngredients()
    }

    /*
     * Get all the ingredients in an array
     */
    fetchIngredients()
    {
        this.setState({
            loading: true
        })

        const $request = axios.get('/admin/ingredients/list')
            .then((response) => {
                this.setState({
                    ingredients: response.data,
                    loading: false
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    updateVisibility(ingredient, e)
    {
        let index = this.state.ingredients.findIndex(ingredientState => ingredientState.id === ingredient.id)
        let approved = !ingredient.approved

        let ingredients = [...this.state.ingredients]
        ingredients[index].approved = approved

        this.setState({
            loading: true,
            ingredients: ingredients,
        })

        axios.post('/admin/ingredients/' + ingredient.id + '/visibility', { approved: approved })
            .then((response) => {
                let index = this.state.ingredients.findIndex(ingredient => ingredient.id === response.data.data.id)

                let ingredients = [...this.state.ingredients]
                ingredients[index].approved = response.data.data.approved

                if (index !== -1) {
                    this.setState(prevState => ({
                        ingredients: ingredients,
                        loading: false
                    }))
                }

            })
            .catch((error) => {
                console.error(error)
            })
    }

    render()
    {
        return (
            <div className="row">
                <div className="col-12">
                    <h1>Ingredients</h1>
                </div>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td style={{ width: '1px' }}> </td>
                        <td style={{ width: '1px' }}> </td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.ingredients.map(ingredient => (
                        <tr key={ ingredient.id }>
                            <td>{ ingredient.name } <small>({ ingredient.recipe_count } recipes)</small></td>
                            <td>
                                <Button
                                color={ ingredient.approved ? 'danger' : 'success' }
                                onClick={ this.updateVisibility.bind(this, ingredient) }
                            >
                                { ingredient.approved ? 'Disapprove' : 'Approve' }
                            </Button>
                            </td>
                            <td>
                                <Button
                                >
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

Ingredients.propTypes = {}