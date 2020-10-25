import React, { useState, useEffect } from 'react'
import { useIngredientsService, useRecipesService } from '../../services'
import { generateId, getDataFromResponse, isSuccessResponse } from '../../global/helpers'
import Autocomplete from '../SearchBar/Autocomplete'

const RecipeForm = () => {
  const recipesService = useRecipesService()
  const ingredientsService = useIngredientsService()
  const [ingredientValue, setIngredientValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [steps, setSteps] = useState({ [generateId(5)]: '' })
  const [form, setForm] = useState({
    name: '',
    thumbnail: '',
    prep_time: 0,
    cook_time: 0,
    yields: 0,
    servings: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }))
  }

  const handleChangeIngredientData = (e) => {
    const {
      name,
      value,
      dataset: { key }
    } = e.target

    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [key]: { ...prevIngredients[key], [name]: value }
    }))
  }

  const onClickAddStep = (e) => {
    e.preventDefault()

    setSteps((prevSteps) => ({
      ...prevSteps,
      [generateId(5)]: ''
    }))
  }

  const handleStep = (e) => {
    const {
      dataset: { key },
      value
    } = e.target

    setSteps((prevSteps) => ({
      ...prevSteps,
      [key]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      ...form,
      steps: Object.keys(steps).map((key) => steps[key]),
      ingredients: Object.keys(selectedIngredients).map((key) => {
        const ingredient = selectedIngredients[key]
        const { uuid, unit, amount } = ingredient

        return {
          uuid,
          unit,
          amount
        }
      })
    }

    const response = await recipesService.add(data)
    console.log(response)
  }

  const onChange = (e) => {
    const value = e.target.value
    setIngredientValue(value)
  }

  /**
   * User selected an ingredient in the dropdown
   *
   * @param {object} e
   */
  const onSelectIngredient = (e) => {
    const uuid = e.target.dataset.uuid
    const ingredient = suggestedIngredients.find((d) => d.uuid === uuid)
    const ingredientData = {
      uuid: ingredient.uuid,
      name: ingredient.name,
      unit: '',
      amount: 0
    }

    if (ingredient) {
      setSelectedIngredients((prevIngredients) => ({
        ...prevIngredients,
        [generateId(5)]: ingredientData
      }))
      setSuggestedIngredients([])
      setIngredientValue('')
    }
  }

  const onClickAddNewIngredient = async () => {
    if (ingredientValue.trim().length > 0) {
      const response = await ingredientsService.add({ name: ingredientValue })

      if (isSuccessResponse(response)) {
        const data = getDataFromResponse(response)

        setSelectedIngredients((prevIngredients) => ({
          ...prevIngredients,
          [generateId(5)]: data
        }))
        setSuggestedIngredients([])
        setIngredientValue('')
      }
    }
  }

  /**
   * Call the API to fetch the suggested ingredients
   */
  useEffect(() => {
    const fetchIngredients = async () => {
      if (ingredientValue.trim().length > 0) {
        const response = await ingredientsService.search(ingredientValue)

        if (isSuccessResponse(response)) {
          const data = getDataFromResponse(response)
          const filtered = data.filter((ingredient) => {
            return !Object.keys(selectedIngredients).some((key) => selectedIngredients[key].uuid === ingredient.uuid)
          })
  
          setSuggestedIngredients(filtered)
        }
      } else {
        setSuggestedIngredients([])
      }
    }

    fetchIngredients()
  }, [ingredientValue])

  return (
    <form action='#' onSubmit={handleSubmit}>
      <div>
        <label htmlFor='name'>
          Name
          <input
            onChange={handleChange}
            value={form.name}
            id='name'
            type='text'
            name='name'
            placeholder='Recipe name'
            style={{ display: 'block' }}
          />
        </label>
      </div>

      <div>
        <p>Ingredients</p>
        <Autocomplete
          canAddNew={true}
          items={suggestedIngredients}
          value={ingredientValue}
          onChange={onChange}
          onClickAddNew={onClickAddNewIngredient}
          onSelect={onSelectIngredient}
        />
        {Object.keys(selectedIngredients).map((key) => (
          <div key={key}>
            <p>{selectedIngredients[key].name}</p>
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              type='text'
              name='unit'
              value={selectedIngredients[key].unit}
            />
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              type='number'
              name='amount'
              value={selectedIngredients[key].amount}
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor='thumbnail'>
          Thumbnail URL
          <input
            onChange={handleChange}
            value={form.thumbnail}
            id='thumbnail'
            type='text'
            name='thumbnail'
            placeholder='Thumbnail URL'
            style={{ display: 'block' }}
          />
        </label>
      </div>

      <div>
        <label htmlFor='prep_time'>
          Preparation Time (minutes)
          <input
            onChange={handleChange}
            value={form.prep_time}
            id='prep_time'
            type='number'
            name='prep_time'
            placeholder='Preparation time (minutes)'
            style={{ display: 'block' }}
          />
        </label>

        <label htmlFor='cook_time'>
          Cooking Time (minutes)
          <input
            onChange={handleChange}
            value={form.cook_time}
            id='cook_time'
            type='number'
            name='cook_time'
            placeholder='Cooking time (minutes)'
            style={{ display: 'block' }}
          />
        </label>
      </div>

      <div>
        <label htmlFor='yields'>
          Yields
          <input
            onChange={handleChange}
            value={form.yields}
            id='yields'
            type='number'
            name='yields'
            placeholder='Yields'
            style={{ display: 'block' }}
          />
        </label>

        <label htmlFor='servings'>
          Servings
          <input
            onChange={handleChange}
            value={form.servings}
            id='servings'
            type='number'
            name='servings'
            placeholder='Servings'
            style={{ display: 'block' }}
          />
        </label>
      </div>

      <div>
        <p>Steps</p>
        {Object.keys(steps).map((key) => (
          <div key={key}>
            <input
              data-key={key}
              onChange={handleStep}
              value={steps[key].value}
              type='text'
              name='steps[]'
              placeholder='Step'
              style={{ display: 'block' }}
            />
          </div>
        ))}
        <div>
          <button onClick={onClickAddStep}>Add a step</button>
        </div>
      </div>

      <div>
        <button type='submit'>Send</button>
      </div>
    </form>
  )
}

export default RecipeForm
