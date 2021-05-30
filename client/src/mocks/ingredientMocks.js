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
  },
  getByUuids: {
    success: {
      status: 'success',
      data: mockIngredients
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  },
  add: {
    success: {
      status: 'success',
      data: {
        uuid: '58cc81d9-7aa7-41f3-a2c9-fe1c641c29df',
        name: 'Fake ingredient',
        created_at: '2021-04-01T20:16:23.893Z',
        recipe_count: 0
      }
    },
    error: {
      status: 'error',
      error: new Error('False Error')
    }
  }
}

export { mockIngredientsServiceResponse, mockIngredients }
