import { useState } from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import SearchBar from '../../components/SearchBar'
import RecipesList from '../../components/RecipesList'
import { useRecipesService } from '../../services'
import { getDataFromResponse, isSuccessResponse, formatArrayQuery } from '../../global/helpers'

const Home = () => {
  const recipeService = useRecipesService()
  const [suggestedRecipes, setSuggestedRecipes] = useState([])

  const onChangeIngredients = async (uuids) => {
    if (uuids.length > 0) {
      const queryString = formatArrayQuery('uuids[]', uuids)

      const response = await recipeService.suggest(queryString)

      if (isSuccessResponse(response)) {
        const data = getDataFromResponse(response)
        setSuggestedRecipes(data)
      }
    } else {
      setSuggestedRecipes([])
    }
  }

  return (
    <Container maxWidth='lg'>
      {/* <Box justifyContent='center'> */}
      <Container maxWidth='sm'>
        <SearchBar useUrl onChangeIngredients={onChangeIngredients} />
      </Container>
      {/* </Box> */}
      <RecipesList items={suggestedRecipes} />
    </Container>
  )
}

export default Home
