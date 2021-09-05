import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useIngredientsService } from '../../services'
import { generateId, getDataFromResponse, isSuccessResponse, replaceNullWith, setDefaultValue } from '../../global/helpers'
import Autocomplete from '../SearchBar/Autocomplete'
import useFormInput from '../../hooks/useFormInput'
import Ingredients from './Ingredients'
import Steps from './Steps'

const RecipeForm = (props) => {
  const { submitRecipe, recipe } = props
  const ingredientsService = useIngredientsService()
  const [ingredientValue, setIngredientValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState({})
  const [steps, setSteps] = useState({ [generateId(5)]: { value: '', section: '' } })
  const name = useFormInput(setDefaultValue('name', '', recipe))
  const thumbnail = useFormInput(setDefaultValue('thumbnail', 0, recipe))
  const prep_time = useFormInput(setDefaultValue('prep_time', 0, recipe))
  const cook_time = useFormInput(setDefaultValue('cook_time', 0, recipe))
  const yields = useFormInput(setDefaultValue('yields', 0, recipe))
  const servings = useFormInput(setDefaultValue('servings', 0, recipe))
  const selectedIngredientsAutocomplete = Object.keys(selectedIngredients).map((key) => selectedIngredients[key])

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
        const { ingredient_recipe_id, uuid, unit, amount, section, weight } = ingredient
        const data = {
          uuid,
          unit,
          amount,
          section,
          weight
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
    console.log(e)
    // const uuid = e.target.dataset.uuid
    const { value } = e

    const ingredient = suggestedIngredients.find((d) => d.uuid === value)

    if (value === ingredientValue && !ingredient) {
      onClickAddNewIngredient()
    } else {
      if (ingredient) {
        const ingredientData = {
          uuid: ingredient.uuid,
          name: ingredient.name,
          unit: '',
          amount: 0,
          section: '',
          weight: 1,
          open: false
        }

        setSelectedIngredients((prevIngredients) => ({
          ...prevIngredients,
          [generateId(5)]: ingredientData
        }))

        setSuggestedIngredients([])
        setIngredientValue('')
      }
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

          setSuggestedIngredients(data)
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

      const ingredientsPrefill = {}
      ingredients.forEach((ingredient) => {
        ingredientsPrefill[generateId(5)] = {
          ingredient_recipe_id: ingredient.ingredients_recipes.id,
          uuid: ingredient.uuid,
          name: ingredient.name,
          amount: replaceNullWith(ingredient.ingredients_recipes.amount, 0),
          unit: replaceNullWith(ingredient.ingredients_recipes.unit, ''),
          section: replaceNullWith(ingredient.ingredients_recipes.section, ''),
          weight: replaceNullWith(ingredient.ingredients_recipes.weight, 1),
          open: false
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

  const handleClickCollapse = (e) => {
    const {
      currentTarget: {
        dataset: { key }
      }
    } = e

    setSelectedIngredients((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        open: !prev[key].open
      }
    }))
  }

  return (
    <form action='#' onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField
            {...name}
            label='Name'
            id='name'
            type='text'
            name='name'
            inputProps={{
              'data-testid': 'recipe-form-input-name'
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...thumbnail}
            id='thumbnail'
            type='text'
            name='thumbnail'
            label='Thumbnail URL'
            style={{ display: 'block' }}
            inputProps={{
              'data-testid': 'recipe-form-input-thumbnail'
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <TextField
                {...prep_time}
                id='prep_time'
                type='number'
                name='prep_time'
                label='Preparation time (minutes)'
                style={{ display: 'block' }}
                inputProps={{
                  'data-testid': 'recipe-form-input-prep-time'
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                {...cook_time}
                id='cook_time'
                type='number'
                name='cook_time'
                label='Cooking time (minutes)'
                style={{ display: 'block' }}
                inputProps={{
                  'data-testid': 'recipe-form-input-cook-time'
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <TextField
                {...yields}
                id='yields'
                type='number'
                name='yields'
                label='Yields'
                style={{ display: 'block' }}
                inputProps={{
                  'data-testid': 'recipe-form-input-yields'
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                {...servings}
                id='servings'
                type='number'
                name='servings'
                label='Servings'
                style={{ display: 'block' }}
                inputProps={{
                  'data-testid': 'recipe-form-input-servings'
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <p>Ingredients</p>
              <Autocomplete
                canAddNew
                items={suggestedIngredients}
                inputValue={ingredientValue}
                handleChangeInput={onChange}
                onSelect={onSelectIngredient}
                selectedIngredients={selectedIngredientsAutocomplete}
              />

              <Ingredients
                handleClickCollapse={handleClickCollapse}
                handleChangeIngredientData={handleChangeIngredientData}
                selectedIngredients={selectedIngredients}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid item xs={12}>
                <p>Steps</p>
              </Grid>

              <Steps steps={steps} handleStep={handleStep} />

              <Grid item xs={12}>
                <Button onClick={onClickAddStep} data-testid='recipe-form-button-add-step'>
                  Add a step
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button type='submit' data-testid='recipe-form-button-submit' variant='contained' size='large'>
            Send
          </Button>
        </Grid>
      </Grid>
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
