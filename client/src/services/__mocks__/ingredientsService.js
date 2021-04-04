import { mockIngredientsServiceResponse } from '../../mocks/ingredientMocks'

export default jest.fn().mockReturnValue({
  search: () => {
    return mockIngredientsServiceResponse.search.success
  },
  add: (data) => {
    mockIngredientsServiceResponse.search.success.name = data.name
    return mockIngredientsServiceResponse.search.success
  }
})
