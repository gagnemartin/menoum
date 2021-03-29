import { mockIngredientsServiceResponse } from '../../mocks/ingredientMocks'

export default () => ({
  search: () => {
    return mockIngredientsServiceResponse.search.success
  }
})
