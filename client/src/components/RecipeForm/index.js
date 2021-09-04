import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
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

      const ingredientsPrefill = ingredients.map((ingredient) => {
        return {
          ingredient_recipe_id: ingredient.ingredients_recipes.id,
          uuid: ingredient.uuid,
          name: ingredient.name,
          amount: replaceNullWith(ingredient.ingredients_recipes.amount, 0),
          unit: replaceNullWith(ingredient.ingredients_recipes.unit, ''),
          section: replaceNullWith(ingredient.ingredients_recipes.section, ''),
          weight: replaceNullWith(ingredient.ingredients_recipes.weight, 1)
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
      <Grid container spacing={3}>
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
            variant='standard'
            inputProps={{
              'data-testid': 'recipe-form-input-thumbnail'
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container xs={12}>
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
                variant='standard'
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
                variant='standard'
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container xs={12}>
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
                variant='standard'
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
                variant='standard'
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <p>Ingredients</p>
          <Autocomplete
            canAddNew
            items={suggestedIngredients}
            inputValue={ingredientValue}
            handleChangeInput={onChange}
            onSelect={onSelectIngredient}
            selectedIngredients={selectedIngredientsAutocomplete}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container xs={12} md={6} spacing={{ xs: 3 }}>
            {Object.keys(selectedIngredients).map((key) => (
              <Grid item xs={12} md={6}>
                <Card key={key}>
                  <CardContent>
                    <Typography variant='h5' data-testid='recipe-form-ingredient-name'>
                      {selectedIngredients[key].name}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          onChange={handleChangeIngredientData}
                          label='Amount'
                          type='number'
                          name='amount'
                          value={selectedIngredients[key].amount}
                          variant='standard'
                          inputProps={{
                            'data-key': key,
                            'data-testid': 'recipe-form-input-ingredient-amount'
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          onChange={handleChangeIngredientData}
                          label='Unit'
                          type='text'
                          name='unit'
                          value={selectedIngredients[key].unit}
                          variant='standard'
                          inputProps={{
                            'data-key': key,
                            'data-testid': 'recipe-form-input-ingredient-unit'
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          onChange={handleChangeIngredientData}
                          label='Section'
                          type='text'
                          name='section'
                          value={selectedIngredients[key].section}
                          variant='standard'
                          inputProps={{
                            'data-key': key,
                            'data-testid': 'recipe-form-input-ingredient-section'
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          onChange={handleChangeIngredientData}
                          label='Weight'
                          type='number'
                          name='weight'
                          value={selectedIngredients[key].weight}
                          variant='standard'
                          inputProps={{
                            'data-key': key,
                            'data-testid': 'recipe-form-input-ingredient-weight',
                            step: 0.1
                          }}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container xs={12} md={6}>
            <Grid item xs={12}>
              <p>Steps</p>
            </Grid>
            {Object.keys(steps).map((key) => (
              <Grid container key={key}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    onChange={handleStep}
                    value={steps[key].value}
                    type='text'
                    name='steps[]'
                    label='Step'
                    inputProps={{
                      'data-key': key,
                      'data-testid': 'recipe-form-input-step'
                    }}
                    variant='standard'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    onChange={handleStep}
                    value={steps[key].section}
                    type='text'
                    name='sections[]'
                    label='Section'
                    inputProps={{
                      'data-key': key,
                      'data-testid': 'recipe-form-input-step-section'
                    }}
                    variant='standard'
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={onClickAddStep} data-testid='recipe-form-button-add-step'>
                Add a step
              </Button>
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
