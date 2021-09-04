import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipeForm from '..'
import { mockRecipes, mockRecipesServiceResponse } from '../../../mocks/recipeMocks'
import { mockIngredients, mockIngredientsServiceResponse } from '../../../mocks/ingredientMocks'
import ingredientsService from '../../../services/ingredientsService'

jest.mock('../../../services/ingredientsService')
const submitRecipe = jest.fn()

describe('<RecipeForm />', () => {
  beforeEach(() => {
    ingredientsService.mockReturnValue({
      search: jest.fn(() => {
        return mockIngredientsServiceResponse.search.success
      }),
      add: jest.fn(() => {
        return mockIngredientsServiceResponse.add.success
      })
    })
  })

  it('should render and match snapshot', () => {
    const { asFragment } = render(<RecipeForm submitRecipe={submitRecipe} />)

    //expect(asFragment()).toMatchSnapshot()
  })

  it('should render with recipe and match snapshot', () => {
    const { asFragment } = render(<RecipeForm submitRecipe={submitRecipe} recipe={mockRecipes[0]} />)

    //expect(asFragment()).toMatchSnapshot()
  })

  it('should not crash if search ingredient returns an error', async () => {
    ingredientsService.mockReturnValue({
      search: jest.fn(() => {
        return mockIngredientsServiceResponse.search.error
      })
    })
    const { queryByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const searchInput = queryByTestId('ingredient-search-input')

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      const dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)

      expect(dropdownItem).not.toBeInTheDocument()
    })
  })

  it('should add an ingredient when user click on ingredient list', async () => {
    const { queryByTestId, queryAllByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const searchInput = queryByTestId('ingredient-search-input')

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      const dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)

      userEvent.click(dropdownItem)
    })

    const ingredientName = queryAllByTestId('recipe-form-ingredient-name')
    const ingredientUnits = queryAllByTestId('recipe-form-input-ingredient-unit')

    expect(ingredientName.length).toBe(1)
    expect(ingredientUnits.length).toBe(1)
  })

  it('should create and add a new ingredient when user click on "Add New"', async () => {
    const { queryByTestId, queryAllByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const searchInput = queryByTestId('ingredient-search-input')
    const fakeIngredient = {
      name: 'Fake New Ingredient'
    }

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, fakeIngredient.name)

    await waitFor(() => {
      const buttonAddNewIngredient = queryByTestId(`ingredient-dropdown-item-${fakeIngredient.name}`)

      userEvent.click(buttonAddNewIngredient)
    })

    await waitFor(() => {
      const ingredientName = queryAllByTestId('recipe-form-ingredient-name')
      const ingredientUnits = queryAllByTestId('recipe-form-input-ingredient-unit')

      expect(ingredientName.length).toBe(1)
      expect(ingredientUnits.length).toBe(1)
    })
  })

  it('should not create and add a new ingredient when user click on "Add New" if API throws an error', async () => {
    ingredientsService.mockReturnValue({
      search: jest.fn(() => {
        return mockIngredientsServiceResponse.search.success
      }),
      add: jest.fn(() => {
        return mockIngredientsServiceResponse.add.error
      })
    })
    const { queryByTestId, queryAllByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const searchInput = queryByTestId('ingredient-search-input')
    const fakeIngredient = {
      name: 'Fake New Ingredient'
    }

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, fakeIngredient.name)

    await waitFor(() => {
      const buttonAddNewIngredient = queryByTestId(`ingredient-dropdown-item-${fakeIngredient.name}`)

      userEvent.click(buttonAddNewIngredient)
    })

    await waitFor(() => {
      const ingredientName = queryAllByTestId('recipe-form-ingredient-name')
      const ingredientUnits = queryAllByTestId('recipe-form-input-ingredient-unit')

      expect(ingredientName.length).toBe(0)
      expect(ingredientUnits.length).toBe(0)
    })
  })

  it('should not show "Add New" if input value its length is 0', async () => {
    const { queryByTestId, queryAllByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const searchInput = queryByTestId('ingredient-search-input')
    const fakeIngredient = {
      name: '   '
    }

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, fakeIngredient.name)

    const buttonAddNewIngredient = queryByTestId(`ingredient-dropdown-item-${fakeIngredient.name}`)

    expect(buttonAddNewIngredient).not.toBeInTheDocument()
  })

  it('should update the ingredient amount, unit and section', async () => {
    const { queryByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const searchInput = queryByTestId('ingredient-search-input')

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      const dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)

      userEvent.click(dropdownItem)
    })

    const ingredientUnit = queryByTestId('recipe-form-input-ingredient-unit')
    const ingredientAmount = queryByTestId('recipe-form-input-ingredient-amount')
    const ingredientSection = queryByTestId('recipe-form-input-ingredient-section')

    const ingredientUnitText = 'G'
    const ingredientAmountText = '2'
    const ingredientSectionText = 'Section name'

    userEvent.type(ingredientUnit, ingredientUnitText)
    userEvent.type(ingredientAmount, `{backspace}${ingredientAmountText}`)
    userEvent.type(ingredientSection, ingredientSectionText)

    await waitFor(() => {
      expect(ingredientUnit.value).toBe(ingredientUnitText)
      expect(ingredientAmount.value).toBe(ingredientAmountText)
      expect(ingredientSection.value).toBe(ingredientSectionText)
    })
  })

  it('should add a step', async () => {
    const { queryAllByTestId, getByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)

    const buttonAddStep = getByTestId('recipe-form-button-add-step')

    userEvent.click(buttonAddStep)

    await waitFor(() => {
      const steps = queryAllByTestId('recipe-form-input-step')

      expect(steps.length).toBe(2)
    })
  })

  it('should update the step value', async () => {
    const { getByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const text = 'Step name'

    const input = getByTestId('recipe-form-input-step')

    userEvent.type(input, text)

    await waitFor(() => {
      expect(input.value).toBe(text)
    })
  })

  it('should update the step section', async () => {
    const { getByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)
    const text = 'Step section'

    const input = getByTestId('recipe-form-input-step-section')

    userEvent.type(input, text)

    await waitFor(() => {
      expect(input.value).toBe(text)
    })
  })

  it('should successfully create the recipe', async () => {
    submitRecipe.mockReturnValueOnce(mockRecipesServiceResponse.update.success)
    const { getByTestId, queryByTestId } = render(<RecipeForm submitRecipe={submitRecipe} />)

    const searchInput = queryByTestId('ingredient-search-input')

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      const dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)

      userEvent.click(dropdownItem)
    })

    const inputRecipeName = queryByTestId('recipe-form-input-name')
    const ingredientUnit = queryByTestId('recipe-form-input-ingredient-unit')
    const ingredientAmount = queryByTestId('recipe-form-input-ingredient-amount')
    const ingredientSection = queryByTestId('recipe-form-input-ingredient-section')
    const inputStep = getByTestId('recipe-form-input-step')
    const inputStepSection = getByTestId('recipe-form-input-step-section')

    const recipeNameText = 'Very weird salad'
    const ingredientUnitText = 'G'
    const ingredientAmountText = '2'
    const ingredientSectionText = 'Section name'
    const stepNameText = 'Make the dressing'
    const stepSectionText = 'Salad'

    userEvent.type(inputRecipeName, recipeNameText)
    userEvent.type(ingredientUnit, ingredientUnitText)
    userEvent.type(ingredientAmount, `{backspace}${ingredientAmountText}`)
    userEvent.type(ingredientSection, ingredientSectionText)
    userEvent.type(inputStep, stepNameText)
    userEvent.type(inputStepSection, stepSectionText)

    const buttonSubmit = queryByTestId('recipe-form-button-submit')
    userEvent.click(buttonSubmit)
  })

  it('should successfully update the recipe', () => {
    submitRecipe.mockReturnValueOnce(mockRecipesServiceResponse.update.success)
    const { queryByTestId } = render(<RecipeForm submitRecipe={submitRecipe} recipe={mockRecipes[0]} />)

    const buttonSubmit = queryByTestId('recipe-form-button-submit')
    userEvent.click(buttonSubmit)
  })

  it('should show an error on update the recipe', () => {
    submitRecipe.mockReturnValueOnce(mockRecipesServiceResponse.update.error)
    const { queryByTestId } = render(<RecipeForm submitRecipe={submitRecipe} recipe={mockRecipes[0]} />)

    const buttonSubmit = queryByTestId('recipe-form-button-submit')
    userEvent.click(buttonSubmit)
  })
})
