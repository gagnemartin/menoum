const IngredientsService = {
  search: async (q) => {
    //if (q.trim().length > 0) {
    return await fetch(`http://localhost:4000/api/v1/ingredients/search?q=${q}`)
      .then((data) => {
        return data.json()
      })
      .then((data) => {
        return data
      })
    //}
  }
}

export default IngredientsService
