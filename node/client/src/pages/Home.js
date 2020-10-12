import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import RecipesList from '../components/RecipesList'

const Home = () => {
  const [ suggestedRecipes, setSuggestedRecipes ] = useState([])

  const onChangeIngredients = uuids => {
    if (uuids.length > 0) {
      const queryString = uuids
        .map((uuid) => {
          return `uuids[]=${uuid}`
        })
        .join('&')

      fetch(`http://localhost:4000/api/v1/recipes/suggest?${queryString}`)
        .then((data) => {
          return data.json()
        })
        .then((data) => {
          setSuggestedRecipes(data)
        })
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