import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useIngredientsService } from '../../services'
import { generateId, getDataFromResponse, isSuccessResponse } from '../../global/helpers'
import Autocomplete from '../SearchBar/Autocomplete'

const RecipeForm = (props) => {
  const { submitRecipe, recipe } = props
  const ingredientsService = useIngredientsService()
  const [ingredientValue, setIngredientValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [steps, setSteps] = useState({ [generateId(5)]: { value: '', section: '' } })
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
      value,
      name
    } = e.target

    const type = name === 'steps[]' ? 'value' : 'section'

    setSteps((prevSteps) => ({
      ...prevSteps,
      [key]: {
        ...prevSteps[key],
        [type]: value
      }
    }))
  }

  const formatSteps = (formSteps) => {
    const formatStep = (value) => {
      return {
        type: 'step',
        value
      }
    }

    const formattedSteps = []
    const arraySteps = Object.keys(formSteps).map((key) => formSteps[key])
    
    arraySteps.forEach(step => {
      const { section, value } = step

      if (section?.trim().length > 0) {
        const sectionIndex = formattedSteps.findIndex((d) => d.type === 'section' && d.value === section.toLowerCase())

        if (sectionIndex === -1) {
          formattedSteps.push({
            type: 'section',
            value: section.toLowerCase(),
            steps: [formatStep(value)]
          })
        } else {
          formattedSteps[sectionIndex].steps.push(formatStep(value))
        }
      } else {
        formattedSteps.push(formatStep(value))
      }
    })

    return formattedSteps
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      ...form,
      steps: formatSteps(steps),
      ingredients: Object.keys(selectedIngredients).map((key) => {
        const ingredient = selectedIngredients[key]
        const { ingredient_recipe_id, uuid, unit, amount, section } = ingredient
        const data = {
          uuid,
          unit,
          amount,
          section
        }

        if (ingredient_recipe_id) {
          data.ingredient_recipe_id = ingredient_recipe_id
        }

        return data
      })
    }

    const response = await submitRecipe(data)

    if (isSuccessResponse(response)) {
      console.log(response)
    } else {
      console.error(response)
    }
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
      amount: 0,
      section: '',
      is_main: false
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

  const replaceNullWith = (value, replaceValue) => {
    return value === null ? replaceValue : value
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

  useEffect(() => {
    if (recipe.uuid) {
      const { name, thumbnail, prep_time, cook_time, yields, servings, steps: stepsDB, ingredients } = recipe

      setForm({
        name,
        thumbnail: replaceNullWith(thumbnail, ''),
        prep_time: replaceNullWith(prep_time, 0),
        cook_time: replaceNullWith(cook_time, 0),
        yields: replaceNullWith(yields, 0),
        servings: replaceNullWith(servings, 0)
      })

      const ingredientsPrefill = ingredients.map((ingredient) => {
        return {
          ingredient_recipe_id: ingredient.ingredients_recipes.id,
          uuid: ingredient.uuid,
          name: ingredient.name,
          amount: replaceNullWith(ingredient.ingredients_recipes.amount, 0),
          unit: replaceNullWith(ingredient.ingredients_recipes.unit, ''),
          section: replaceNullWith(ingredient.ingredients_recipes.section, '')
        }
      })

      setSelectedIngredients(ingredientsPrefill)

      const stepsPrefill = {}
      stepsDB.forEach((step) => {
          if (step.type === 'section') {
            step.steps.forEach(d => {
              stepsPrefill[generateId()] = {
                value: d.value,
                section: step.value
              }
            })
          } else {
            stepsPrefill[generateId()] = { value: step.value, section: '' }
          }
      })

      setSteps(stepsPrefill)
    }
  }, [])

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

      <fieldset>
        <legend>Ingredients</legend>
        <Autocomplete
          canAddNew={true}
          items={suggestedIngredients}
          value={ingredientValue}
          onChange={onChange}
          onClickAddNew={onClickAddNewIngredient}
          onSelect={onSelectIngredient}
        />
        {Object.keys(selectedIngredients).map((key) => (
          <fieldset key={key}>
            <legend>{selectedIngredients[key].name}</legend>
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              placeholder='Amount'
              type='number'
              name='amount'
              value={selectedIngredients[key].amount}
            />
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              placeholder='Unit'
              type='text'
              name='unit'
              value={selectedIngredients[key].unit}
            />
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              placeholder='Section'
              type='text'
              name='section'
              value={selectedIngredients[key].section}
            />
          </fieldset>
        ))}
      </fieldset>

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

      <fieldset>
        <legend>Steps</legend>
        {Object.keys(steps).map((key) => (
          <div key={key}>
            <input
              data-key={key}
              onChange={handleStep}
              value={steps[key].value}
              type='text'
              name='steps[]'
              placeholder='Step'
            />
            <input
              data-key={key}
              onChange={handleStep}
              value={steps[key].section}
              type='text'
              name='sections[]'
              placeholder='Section'
            />
          </div>
        ))}
        <div>
          <button onClick={onClickAddStep}>Add a step</button>
        </div>
      </fieldset>

      <div>
        <button type='submit'>Send</button>
      </div>
    </form>
  )
}

RecipeForm.propTypes = {
  recipe: PropTypes.object,
  submitRecipe: PropTypes.func.isRequired
}

RecipeForm.defaultProps = {
  recipe: {}
}

export default RecipeForm
