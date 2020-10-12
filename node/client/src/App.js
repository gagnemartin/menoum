import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import './App.css';

function App() {
  const [searchInputValue, setSearchInputValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])

  const [suggestedRecipes, setSuggestedRecipes] = useState([])

  const handleChange = (e) => {
    const value = e.target.value
    setSearchInputValue(value)
  }

  const handleClickIngredient = (e) => {
    const uuid = e.target.dataset.uuid
    const ingredient = suggestedIngredients.find((d) => d.uuid === uuid)

    if (ingredient) {
      setSelectedIngredients([...selectedIngredients, ingredient])
      setSuggestedIngredients([])
      setSearchInputValue('')
    }
  }

  const handleClickRemove = (e) => {
    const uuid = e.target.dataset.uuid
    const ingredient = selectedIngredients.find((d) => d.uuid === uuid)

    if (ingredient) {
      setSelectedIngredients(
        selectedIngredients.filter((d) => d.uuid !== ingredient.uuid)
      )
    }
  }

  // const searchIngredients = async (q) => {
  //   const data = await fetch(`/api/ingredients/search?q=${searchInputValue}`)

  //   console.log(data)
  // }

  useEffect(() => {
    if (searchInputValue.trim().length > 0) {
      // searchIngredients(searchInputValue)
      fetch(
        `http://localhost:4000/api/v1/ingredients/search?q=${searchInputValue}`
      )
        .then((data) => {
          return data.json()
        })
        .then((data) => {
          const ingredients = data.filter((ingredient) => {
            return !selectedIngredients.some((d) => d.uuid === ingredient.uuid)
          })

          setSuggestedIngredients(ingredients)
        })
    } else {
      setSuggestedIngredients([])
    }
  }, [searchInputValue])

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const uuids = selectedIngredients.map((ingredient) => ingredient.uuid)
      const queryString = uuids
        .map((uuid) => {
          return `uuids[]=${uuid}`
        })
        .join('&')

      fetch(`http://localhost:4000/api/v1/recipes/suggest?${queryString}`)
        .then((data) => {
          return data.json()
        })
        .then((data) => {
          setSuggestedRecipes(data)
        })
    } else {
      setSuggestedRecipes([])
    }
  }, [selectedIngredients])

  return (
    <div className='App'>
      <input type='text' value={searchInputValue} onChange={handleChange} />

      <div style={{ margin: '10px' }}>
        {selectedIngredients.map((ingredient) => (
          <span
            key={ingredient.uuid}
            style={{
              border: 'solid 1px lightgray',
              marginRight: '10px',
              padding: '5px',
            }}
          >
            {ingredient.name}
            <button
              onClick={handleClickRemove}
              data-uuid={ingredient.uuid}
              style={{ marginLeft: '10px' }}
            >
              X
            </button>
          </span>
        ))}
      </div>

      <div>
        {suggestedIngredients.map((ingredient) => (
          <p
            key={ingredient.uuid}
            data-uuid={ingredient.uuid}
            onClick={handleClickIngredient}
          >
            {ingredient.name}
          </p>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          columnGap: '20px',
        }}
      >
        {suggestedRecipes.map((recipe) => (
          <div key={recipe.uuid}>
            <img src={recipe.thumbnail} width='100%' />
            <p>{recipe.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
