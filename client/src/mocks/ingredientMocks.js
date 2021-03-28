const mockIngredients = [
  {
    uuid: 'fakeIngredientUuid',
    name: 'Potato'
  }
]

const mockIngredientsServiceResponse = {
  search: {
    success: {
      status: 'success',
      data: mockIngredients
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  }
}

export { mockIngredientsServiceResponse, mockIngredients }
