import { mockRecipesServiceResponse } from '../../mocks/recipeMocks'

export default jest.fn(() => ({
  add: () => {
    return mockRecipesServiceResponse.add.success
  },
  suggest: () => {
    return mockRecipesServiceResponse.suggest.success
  },
  update: () => {
    return mockRecipesServiceResponse.update.success
  },
  get: () => {
    return mockRecipesServiceResponse.get.success
  }
}))
