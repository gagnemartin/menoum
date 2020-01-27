import React, { Component } from 'react'
import { Button, Card, CardBody, CardImg, CardTitle } from "reactstrap"

export default class Recipes extends Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        let recipes = this.props.recipes
        return (
            recipes.length > 0 &&
                <div className="row mt-5">
                    <div className="col-12 grid-4">
                        { recipes.map((recipe, index) => (
                            <Card key={ index }>
                                <CardImg top width="100%" src={ recipe.media[0].url } alt={ recipe.media[0].name } />
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
        )
    }
}