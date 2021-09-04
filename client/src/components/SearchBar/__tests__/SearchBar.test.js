import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SearchBar from '../'
import ingredientsService from '../../../services/ingredientsService'
import { mockIngredients, mockIngredientsServiceResponse } from '../../../mocks/ingredientMocks'

jest.mock('../../../services/ingredientsService')

const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(component, { wrapper: Router })
}

describe('<SearchBar />', () => {
  const onChangeIngredients = jest.fn()

  beforeEach(() => {
    ingredientsService.mockReturnValue({
      search: jest.fn(() => {
        return mockIngredientsServiceResponse.search.success
      }),
      getByUuids: jest.fn(() => {
        return mockIngredientsServiceResponse.search.success
      })
    })
  })

  it('should remove a selected ingredient', async () => {
    const { queryByTestId } = renderWithRouter(<SearchBar onChangeIngredients={onChangeIngredients} />)
    const searchInput = queryByTestId('ingredient-search-input')
    let dropdownItem

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)
      userEvent.click(dropdownItem)
    })

    const selectedIngredient = queryByTestId(`selected-ingredient-${mockIngredients[0].uuid}`)
    const selectedIngredientRemove = queryByTestId(`selected-ingredient-remove-${mockIngredients[0].uuid}`)

    expect(selectedIngredient).toBeInTheDocument()

    userEvent.click(selectedIngredientRemove)

    expect(selectedIngredient).not.toBeInTheDocument()
  })

  it('should update the URL when selecting an ingredient', async () => {
    const { queryByTestId } = renderWithRouter(<SearchBar onChangeIngredients={onChangeIngredients} useUrl />)
    const searchInput = queryByTestId('ingredient-search-input')
    let dropdownItem

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)
      userEvent.click(dropdownItem)
    })

    const url = new URL(window.location)
    const searchParams = new URLSearchParams(url.search)

    expect(searchParams.get('ingredients[]')).toEqual(mockIngredients[0].uuid)
  })

  it('should update the URL and selected ingredients when user uses the browser Previous and Forward', async () => {
    window.history.pushState({}, 'Test page', '/')
    let testHistory, testLocation

    const { queryByTestId } = render(
      <Router>
        <SearchBar onChangeIngredients={onChangeIngredients} useUrl />
        <Route
          path='*'
          render={({ history, location }) => {
            testHistory = history
            testLocation = location
            return null
          }}
        />
      </Router>
    )

    const searchInput = queryByTestId('ingredient-search-input')
    let dropdownItem

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)
      userEvent.click(dropdownItem)
    })

    let searchParams = new URLSearchParams(testLocation.search)

    expect(searchParams.get('ingredients[]')).toEqual(mockIngredients[0].uuid)

    testHistory.goBack()

    await waitFor(() => {
      searchParams = new URLSearchParams(testLocation.search)
      expect(searchParams.has('ingredients[]')).toBeFalsy()
    })

    testHistory.goForward()

    await waitFor(() => {
      searchParams = new URLSearchParams(testLocation.search)
      expect(searchParams.get('ingredients[]')).toEqual(mockIngredients[0].uuid)
    })
  })

  it('should only add ingredients from the URL when they exist in the list', async () => {
    window.history.pushState({}, 'Test page', '/')
    const fakeUUID = 'fakeUUID'
    let testHistory, testLocation

    const { queryByTestId } = render(
      <Router>
        <SearchBar onChangeIngredients={onChangeIngredients} useUrl />
        <Route
          path='*'
          render={({ history, location }) => {
            testHistory = history
            testLocation = location
            return null
          }}
        />
      </Router>
    )
    testHistory.push('/')
    testHistory.push({ search: `ingredients[]=${fakeUUID}` })

    testHistory.goBack()

    await waitFor(() => {
      const searchParams = new URLSearchParams(testLocation.search)

      expect(searchParams.get('ingredients[]')).toBe(fakeUUID)
    })

    testHistory.goForward()

    await waitFor(() => {
      const selectedIngredient = queryByTestId(`selected-ingredient-${fakeUUID}`)
      const searchParams = new URLSearchParams(testLocation.search)

      expect(searchParams.get('ingredients[]')).toEqual(fakeUUID)
      expect(selectedIngredient).not.toBeInTheDocument()
    })
  })

  it('should not update the URL and selected ingredients when user uses the browser Previous and Forward and API returns an error', async () => {
    ingredientsService.mockReturnValue({
      search: jest.fn(() => {
        return mockIngredientsServiceResponse.search.success
      }),
      getByUuids: jest.fn(() => {
        return mockIngredientsServiceResponse.search.error
      })
    })

    window.history.pushState({}, 'Test page', '/')
    let testHistory, testLocation

    const { queryByTestId } = render(
      <Router>
        <SearchBar onChangeIngredients={onChangeIngredients} useUrl />
        <Route
          path='*'
          render={({ history, location }) => {
            testHistory = history
            testLocation = location
            return null
          }}
        />
      </Router>
    )

    const searchInput = queryByTestId('ingredient-search-input')
    let dropdownItem

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      dropdownItem = queryByTestId(`ingredient-dropdown-item-${mockIngredients[0].uuid}`)
      userEvent.click(dropdownItem)
    })

    let searchParams = new URLSearchParams(testLocation.search)

    expect(searchParams.get('ingredients[]')).toEqual(mockIngredients[0].uuid)

    testHistory.goBack()

    await waitFor(() => {
      searchParams = new URLSearchParams(testLocation.search)
      expect(searchParams.has('ingredients[]')).toBeFalsy()
    })

    testHistory.goForward()

    await waitFor(() => {
      const selectedIngredient = queryByTestId(`selected-ingredient-${mockIngredients[0].uuid}`)
      searchParams = new URLSearchParams(testLocation.search)

      expect(searchParams.get('ingredients[]')).toEqual(mockIngredients[0].uuid)
      expect(selectedIngredient).not.toBeInTheDocument()
    })
  })

  it('should fetch the ingredients when page load with ingredients in URL', async () => {
    const { queryByTestId } = renderWithRouter(<SearchBar onChangeIngredients={onChangeIngredients} useUrl />, {
      route: `?ingredients[]=${mockIngredients[0].uuid}`
    })

    await waitFor(() => {
      const selectedIngredient = queryByTestId(`selected-ingredient-${mockIngredients[0].uuid}`)

      expect(selectedIngredient).toBeInTheDocument()
    })
  })

  it('should not set suggested ingredients in dropdown if there is an API error', async () => {
    ingredientsService.mockReturnValue({
      search: jest.fn(() => {
        return mockIngredientsServiceResponse.search.error
      })
    })
    const { queryByTestId, queryAllByTestId } = renderWithRouter(<SearchBar onChangeIngredients={onChangeIngredients} />)
    const searchInput = queryByTestId('ingredient-search-input')

    userEvent.type(searchInput, mockIngredients[0].name)

    await waitFor(() => {
      const dropdownItems = queryAllByTestId('ingredient-dropdown-item')
      expect(dropdownItems.length).toBe(0)
    })
  })

  it("should not set seleced ingredients from URL on page load if UUID doesn't exists", async () => {
    const badUUID = 'badUUID'
    const { queryByTestId } = renderWithRouter(<SearchBar onChangeIngredients={onChangeIngredients} />, {
      route: `/?ingredients[]=${badUUID}`
    })

    await waitFor(() => {
      const selectedIngredient = queryByTestId(`selected-ingredient-${badUUID}`)

      expect(selectedIngredient).not.toBeInTheDocument()
    })
  })

  it('should not set seleced ingredients from URL on page load if API returns an error', async () => {
    ingredientsService.mockReturnValue({
      getByUuids: jest.fn(() => {
        return mockIngredientsServiceResponse.search.error
      })
    })
    const badUUID = 'badUUID'
    const { queryByTestId } = renderWithRouter(<SearchBar onChangeIngredients={onChangeIngredients} />, {
      route: `/?ingredients[]=${badUUID}`
    })

    await waitFor(() => {
      const selectedIngredient = queryByTestId(`selected-ingredient-${badUUID}`)

      expect(selectedIngredient).not.toBeInTheDocument()
    })
  })
})
