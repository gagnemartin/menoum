import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import RecipesList from '../components/RecipesList'
import { useRecipesService } from '../services'
import { getDataFromResponse, isSuccessResponse } from '../global/helpers'

const Home = () => {
  const recipeService = useRecipesService()
  const [ suggestedRecipes, setSuggestedRecipes ] = useState([])

  const onChangeIngredients = async uuids => {
    if (uuids.length > 0) {
      const queryString = uuids
        .map((uuid) => {
          return `uuids[]=${uuid}`
        })
        .join('&')

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
    <>
      <SearchBar onChangeIngredients={onChangeIngredients} />
      <RecipesList items={suggestedRecipes} />
    </>
  )
}

export default Home