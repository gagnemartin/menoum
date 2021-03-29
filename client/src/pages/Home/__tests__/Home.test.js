import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router } from 'react-router-dom'
import Home from '../'
import useRecipesService from '../../../services/recipesService'
import { mockRecipesServiceResponse, mockRecipes } from '../../../mocks/recipeMocks'
import { mockIngredients } from '../../../mocks/ingredientMocks'

jest.mock('../../../services/recipesService')

jest.mock('../../../services/ingredientsService')

const customRender = (children) => {
  return render(<Router>{children}</Router>)
}

describe('<Home />', () => {
  it('should show the search input', async () => {
    // useRecipesService.mockReturnValue({
    //   suggest: jest.fn(() => {
    //     return mockRecipesServiceResponse.suggest.success
    //   })
    // })
    const { queryByTestId } = customRender(<Home />)

    await waitFor(() => {
      const element = queryByTestId('ingredient-search-input')
      expect(element).toBeInTheDocument()
    })
  })

  it('should suggest recipes when ingredients change', async () => {
    useRecipesService.mockReturnValue({
      suggest: jest.fn(() => {
        return mockRecipesServiceResponse.suggest.success
      })
    })
    const { queryByTestId, queryAllByTestId, queryByText } = customRender(<Home />)
    const searchInput = queryByTestId('ingredient-search-input')

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      const dropdownItem = queryByText(mockIngredients[0].name)
      expect(dropdownItem).toBeInTheDocument()

      userEvent.click(dropdownItem)
    })

    const recipeItem = queryByText(mockRecipes[0].name)
    expect(recipeItem).toBeInTheDocument()
  })

  it('should not suggest recipes if the request fails', async () => {
    useRecipesService.mockReturnValue({
      suggest: jest.fn(() => {
        return mockRecipesServiceResponse.suggest.error
      })
    })
    const { queryByTestId, queryAllByTestId, queryByText } = customRender(<Home />)
    const searchInput = queryByTestId('ingredient-search-input')

    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, 'Potato')

    await waitFor(() => {
      const dropdownItem = queryByText(mockIngredients[0].name)
      expect(dropdownItem).toBeInTheDocument()

      userEvent.click(dropdownItem)
    })

    const recipeItem = queryByText(mockRecipes[0].name)
    expect(recipeItem).not.toBeInTheDocument()
  })
})
