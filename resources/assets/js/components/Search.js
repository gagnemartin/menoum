import React, { Component } from 'react'
import SearchInput from './Search/SearchInput'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

export default class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ingredients: null,
            recipes: null
        }
    }

    getRecipes(data)
    {
        this.setState({
            loading: true
        })

        let self = this
        const $request = axios.get('/recipe', {
            params: data
        })
            .then(function (response) {
                self.setState({
                    recipes: response.data,
                    loading: false
                })
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    render()
    {
        return (
            <div className="container">
                <h1 className="text-center my-5">Menoum</h1>
                <SearchInput
                    getRecipes={ this.getRecipes.bind(this) }
                />

                { this.state.recipes !== null &&
                <div className="row mt-5">
                    <div className="col-12 grid-4">
                        { this.state.recipes.map((recipe, index) => (
                            <Card key={ index }>
                                <CardImg top width="100%" src={"http://lorempicsum.com/futurama/627/350/" + (Math.floor(Math.random() * Math.floor(3)) + 1)} alt="Card image cap" />
                                <CardBody>
                                    <CardTitle>{ recipe.name }</CardTitle>
                                    <ul>
                                        <li>{ recipe.ingredient_count } ingredients</li>
                                        <li>{ recipe.preparation } minutes of preparation</li>
                                        <li>{ recipe.cooking } minutes of cooking</li>
                                        <li>{ recipe.total_time } minutes total</li>
                                    </ul>
                                    <Button>Button</Button>
                                </CardBody>
                            </Card>
                        )) }
                    </div>
                </div>
                }
            </div>
        );
    }
}