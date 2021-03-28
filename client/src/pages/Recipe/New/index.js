import { useRecipesService } from '../../../services'
import RecipeForm from '../../../components/RecipeForm'

const NewRecipe = () => {
  const recipesService = useRecipesService()

  const submitRecipe = async (data) => {
    const response = await recipesService.add(data)
    return response
  }

  return (
    <div data-testid='page-recipe-new'>
      <h1>New Recipe</h1>

      <RecipeForm submitRecipe={submitRecipe} />
    </div>
  )
}

export default NewRecipe
