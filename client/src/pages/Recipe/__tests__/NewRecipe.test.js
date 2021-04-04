import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewRecipe from '../New'
import { mockRecipesServiceResponse } from '../../../mocks/recipeMocks'

jest.mock('../../../services/recipesService', () => {
  return () => ({
    add: () => {
      return mockRecipesServiceResponse.add.success
    }
  })
})

describe('<NewRecipe />', () => {
  it('should render the page', () => {
    const { queryByTestId } = render(<NewRecipe />)
    expect(queryByTestId('page-recipe-new')).toBeInTheDocument()
  })

  it('should request the service to add the recipe', async () => {
    const { queryByTestId } = render(<NewRecipe />)
    const buttonSubmit = queryByTestId('recipe-form-button-submit')
    expect(buttonSubmit).toBeInTheDocument()

    userEvent.click(buttonSubmit)
  })
})
