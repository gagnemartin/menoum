import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router } from 'react-router-dom'
import UpdateRecipe from '../Update'
import { mockRecipesServiceResponse } from '../../../mocks/recipeMocks'

jest.mock('../../../services/recipesService', () => {
  return () => ({
    update: () => {
      return mockRecipesServiceResponse.update.success
    },
    get: () => {
      return mockRecipesServiceResponse.get.success
    }
  })
})

const customRender = (children) => {
  return render(<Router initialEntries={['/recipe/update?uuid=test']}>{children}</Router>)
}

describe('<UpdateRecipe />', () => {
  it('should render the page', async () => {
    const { queryByTestId } = customRender(<UpdateRecipe />)

    await waitFor(() => {
      expect(queryByTestId('page-recipe-update')).toBeInTheDocument()
    })
  })

  it('should request the service to add the recipe', async () => {
    const { queryByTestId } = customRender(<UpdateRecipe />)

    await waitFor(() => {
      const buttonSubmit = queryByTestId('button-submit-recipe')
      expect(buttonSubmit).toBeInTheDocument()

      userEvent.click(buttonSubmit)
    })
  })
})
