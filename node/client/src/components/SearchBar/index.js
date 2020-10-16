import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import IngredientsService from '../../services/ingredientsService'
import Autocomplete from './Autocomplete'
import IngredientsList from './IngredientsList'

const SearchBar = (props) => {
  const { onChangeIngredients } = props

  const [searchInputValue, setSearchInputValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])

  /**
   * User writes in the input
   *
   * @param {object} e
   */
  const handleChange = (e) => {
    const value = e.target.value
    setSearchInputValue(value)
  }

  /**
   * User selected an ingredient in the dropdown
   *
   * @param {object} e
   */
  const handleClickIngredient = (e) => {
    const uuid = e.target.dataset.uuid
    const ingredient = suggestedIngredients.find((d) => d.uuid === uuid)

    if (ingredient) {
      setSelectedIngredients([...selectedIngredients, ingredient])
      setSuggestedIngredients([])
      setSearchInputValue('')
    }
  }

  /**
   * User removed a selected ingredient
   *
   * @param {object} e
   */
  const handleRemove = (e) => {
    const uuid = e.target.dataset.uuid
    const ingredient = selectedIngredients.find((d) => d.uuid === uuid)

    if (ingredient) {
      setSelectedIngredients(
        selectedIngredients.filter((d) => d.uuid !== ingredient.uuid)
      )
    }
  }

  /**
   * List of selected ingredients changed
   */
  const handleIngredientsChange = () => {
    const uuids = selectedIngredients.map((ingredient) => ingredient.uuid)
    onChangeIngredients(uuids)
  }

  /**
   * Call the API to fetch the suggested ingredients
   */
  useEffect(() => {
    const fetchIngredients = async () => {
      if (searchInputValue.trim().length > 0) {
        const ingredients = await IngredientsService.search(searchInputValue)
        const filtered = ingredients.filter((ingredient) => {
          return !selectedIngredients.some((d) => d.uuid === ingredient.uuid)
        })

        setSuggestedIngredients(filtered)
      } else {
        setSuggestedIngredients([])
      }
    }

    fetchIngredients()
  }, [searchInputValue])

  useEffect(handleIngredientsChange, [selectedIngredients])

  return (
    <div>
      <Autocomplete
        items={suggestedIngredients}
        onChange={handleChange}
        onSelect={handleClickIngredient}
        value={searchInputValue}
      />
      <IngredientsList
        handleRemove={handleRemove}
        items={selectedIngredients}
      />
    </div>
  )
}

SearchBar.propTypes = {
  onChangeIngredients: PropTypes.func.isRequired
}

export default SearchBar
