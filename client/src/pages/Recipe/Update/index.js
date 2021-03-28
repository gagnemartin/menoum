import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecipesService } from '../../../services'
import RecipeForm from '../../../components/RecipeForm'

const UpdateRecipe = () => {
  const { uuid } = useParams()
  const recipesService = useRecipesService()
  const [isLoading, setIsLoading] = useState(true)
  const [recipe, setRecipe] = useState({})

  const submitRecipe = async (data) => {
    const response = await recipesService.update({ ...data, uuid: recipe.uuid })
    return response
  }

  useEffect(() => {
    const getRecipe = async () => {
      const response = await recipesService.get(uuid)

      setRecipe(response.data)
      setIsLoading(false)
    }

    getRecipe()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div data-testid='page-recipe-update'>
      <h1>Update Recipe</h1>

      <RecipeForm submitRecipe={submitRecipe} recipe={recipe} />
    </div>
  )
}

export default UpdateRecipe
