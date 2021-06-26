import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useIngredientsService } from '../../services'
import { generateId, getDataFromResponse, isSuccessResponse, replaceNullWith, setDefaultValue } from '../../global/helpers'
import Autocomplete from '../SearchBar/Autocomplete'
import useFormInput from '../../hooks/useFormInput'

const RecipeForm = (props) => {
  const { submitRecipe, recipe } = props
  const ingredientsService = useIngredientsService()
  const [ingredientValue, setIngredientValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [steps, setSteps] = useState({ [generateId(5)]: { value: '', section: '' } })
  const name = useFormInput(setDefaultValue('name', '', recipe))
  const thumbnail = useFormInput(setDefaultValue('thumbnail', 0, recipe))
  const prep_time = useFormInput(setDefaultValue('prep_time', 0, recipe))
  const cook_time = useFormInput(setDefaultValue('cook_time', 0, recipe))
  const yields = useFormInput(setDefaultValue('yields', 0, recipe))
  const servings = useFormInput(setDefaultValue('servings', 0, recipe))

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

    arraySteps.forEach((step) => {
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

  const formatData = () => {
    return {
      name: name.value,
      thumbnail: thumbnail.value,
      prep_time: prep_time.value,
      cook_time: cook_time.value,
      yields: yields.value,
      servings: servings.value,
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = formatData()

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

    if (ingredient) {
      const ingredientData = {
        uuid: ingredient.uuid,
        name: ingredient.name,
        unit: '',
        amount: 0,
        section: '',
        weight: 1
      }
      
      setSelectedIngredients((prevIngredients) => ({
        ...prevIngredients,
        [generateId(5)]: ingredientData
      }))
      setSuggestedIngredients([])
      setIngredientValue('')
    }
  }

  const onClickAddNewIngredient = async (e) => {
    e.preventDefault()

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

  useEffect(() => {
    if (recipe.uuid) {
      const { steps: stepsDB, ingredients } = recipe

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
          step.steps.forEach((d) => {
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
            {...name}
            id='name'
            type='text'
            name='name'
            placeholder='Recipe name'
            style={{ display: 'block' }}
            data-testid='recipe-form-input-name'
          />
        </label>
      </div>

      <fieldset>
        <legend>Ingredients</legend>
        <Autocomplete
          canAddNew
          items={suggestedIngredients}
          value={ingredientValue}
          onChange={onChange}
          onClickAddNew={onClickAddNewIngredient}
          onSelect={onSelectIngredient}
        />
        {Object.keys(selectedIngredients).map((key) => (
          <fieldset key={key}>
            <legend data-testid={'recipe-form-ingredient-name'}>{selectedIngredients[key].name}</legend>
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              placeholder='Amount'
              type='number'
              name='amount'
              value={selectedIngredients[key].amount}
              data-testid='recipe-form-input-ingredient-amount'
            />
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              placeholder='Unit'
              type='text'
              name='unit'
              value={selectedIngredients[key].unit}
              data-testid='recipe-form-input-ingredient-unit'
            />
            <input
              onChange={handleChangeIngredientData}
              data-key={key}
              placeholder='Section'
              type='text'
              name='section'
              value={selectedIngredients[key].section}
              data-testid='recipe-form-input-ingredient-section'
            />
          </fieldset>
        ))}
      </fieldset>

      <div>
        <label htmlFor='thumbnail'>
          Thumbnail URL
          <input
            {...thumbnail}
            id='thumbnail'
            type='text'
            name='thumbnail'
            placeholder='Thumbnail URL'
            style={{ display: 'block' }}
            data-testid='recipe-form-input-thumbnail'
          />
        </label>
      </div>

      <div>
        <label htmlFor='prep_time'>
          Preparation Time (minutes)
          <input
            {...prep_time}
            id='prep_time'
            type='number'
            name='prep_time'
            placeholder='Preparation time (minutes)'
            style={{ display: 'block' }}
            data-testid='recipe-form-input-prep-time'
          />
        </label>

        <label htmlFor='cook_time'>
          Cooking Time (minutes)
          <input
            {...cook_time}
            id='cook_time'
            type='number'
            name='cook_time'
            placeholder='Cooking time (minutes)'
            style={{ display: 'block' }}
            data-testid='recipe-form-input-cook-time'
          />
        </label>
      </div>

      <div>
        <label htmlFor='yields'>
          Yields
          <input
            {...yields}
            id='yields'
            type='number'
            name='yields'
            placeholder='Yields'
            style={{ display: 'block' }}
            data-testid='recipe-form-input-yields'
          />
        </label>

        <label htmlFor='servings'>
          Servings
          <input
            {...servings}
            id='servings'
            type='number'
            name='servings'
            placeholder='Servings'
            style={{ display: 'block' }}
            data-testid='recipe-form-input-servings'
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
              data-testid='recipe-form-input-step'
            />
            <input
              data-key={key}
              onChange={handleStep}
              value={steps[key].section}
              type='text'
              name='sections[]'
              placeholder='Section'
              data-testid='recipe-form-input-step-section'
            />
          </div>
        ))}
        <div>
          <button onClick={onClickAddStep} data-testid='recipe-form-button-add-step'>
            Add a step
          </button>
        </div>
      </fieldset>

      <div>
        <button type='submit' data-testid='recipe-form-button-submit'>
          Send
        </button>
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
