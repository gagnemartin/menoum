import React from 'react'
import { useRecipesService } from '../services'
import RecipeForm from '../components/RecipeForm'

const NewRecipe = () => {
  const recipesService = useRecipesService()

  const submitRecipe = async (data) => {
    const response = await recipesService.add(data)
    return response
  }

  return (
    <div>
      <h1>New Recipe</h1>

      <RecipeForm submitRecipe={submitRecipe} />
    </div>
  )
}

export default NewRecipe
