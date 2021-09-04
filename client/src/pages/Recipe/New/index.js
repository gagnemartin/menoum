import { useRecipesService } from '../../../services'
import RecipeForm from '../../../components/RecipeForm'
import { PageContainer, PageHeader, PageTitle } from '../../../components/Layout'

const NewRecipe = () => {
  const recipesService = useRecipesService()

  const submitRecipe = async (data) => {
    const response = await recipesService.add(data)
    return response
  }

  return (
    <>
      <PageHeader>
        <PageContainer maxWidth='xl'>
          <PageTitle textAlign='left'>New Recipe</PageTitle>
        </PageContainer>
      </PageHeader>

      <PageContainer maxWidth='xl' data-testid='page-recipe-new'>
        <RecipeForm submitRecipe={submitRecipe} />
      </PageContainer>
    </>
  )
}

export default NewRecipe
