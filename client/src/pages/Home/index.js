import { useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import SearchBar from '../../components/SearchBar'
import RecipesList from '../../components/RecipesList'
import { useRecipesService } from '../../services'
import { getDataFromResponse, isSuccessResponse, formatArrayQuery } from '../../global/helpers'
import { PageHeader, PageTitle } from '../../components/Layout'

const Home = () => {
  const recipeService = useRecipesService()
  const [suggestedRecipes, setSuggestedRecipes] = useState([])
  const [titleVisible, setTitleVisible] = useState(true)

  const onChangeIngredients = async (uuids) => {
    if (uuids.length > 0) {
      const queryString = formatArrayQuery('uuids[]', uuids)

      const response = await recipeService.suggest(queryString)

      if (isSuccessResponse(response)) {
        const data = getDataFromResponse(response)
        setSuggestedRecipes(data)
        setTitleVisible(false)
      }
    } else {
      setSuggestedRecipes([])
    }
  }

  return (
    <>
      <Collapse in={titleVisible}>
        <PageHeader>
          <PageTitle>Menoum</PageTitle>
        </PageHeader>
      </Collapse>
      <Container maxWidth='sm'>
        <Box pt={4} pb={8}>
          <SearchBar useUrl onChangeIngredients={onChangeIngredients} />
        </Box>
      </Container>

      <Container maxWidth='lg'>
        <RecipesList items={suggestedRecipes} />
      </Container>
    </>
  )
}

export default Home
