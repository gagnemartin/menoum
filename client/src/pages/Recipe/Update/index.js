import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageContainer, PageHeader, PageTitle } from '../../../components/Layout'
import { useRecipesService } from '../../../services'
import RecipeForm from '../../../components/RecipeForm'

const UpdateRecipe = () => {
  const { uuid } = useParams()
  const recipesService = useRecipesService()
  const [isLoading, setIsLoading] = useState(true)
  const [recipe, setRecipe] = useState({})

  const submitRecipe = async (data) => {
    console.log({ ...data, uuid: recipe.uuid })
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
    <>
      <PageHeader>
        <PageContainer maxWidth='xl'>
          <PageTitle textAlign='left'>Update recipe</PageTitle>
        </PageContainer>
      </PageHeader>

      <PageContainer maxWidth='xl' data-testid='page-recipe-update'>
        <RecipeForm submitRecipe={submitRecipe} recipe={recipe} />
      </PageContainer>
    </>
  )
}

export default UpdateRecipe
