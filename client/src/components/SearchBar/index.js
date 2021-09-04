import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import { isEqual } from 'lodash'
import { useIngredientsService } from '../../services'
import Autocomplete from './Autocomplete'
// import IngredientsList from './IngredientsList'
import { isSuccessResponse, getDataFromResponse, formatArrayQuery } from '../../global/helpers'

const URL_KEY = 'ingredients[]'

const SearchBar = ({ onChangeIngredients, useUrl, size }) => {
  const history = useHistory()
  const location = useLocation()
  const ingredientsService = useIngredientsService()
  const [searchInputValue, setSearchInputValue] = useState('')
  const [suggestedIngredients, setSuggestedIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])

  const getSearchParams = (key) => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.getAll(key)
  }

  /**
   * User writes in the input
   *
   * @param {object} e
   */
  const handleChangeInput = (e) => {
    // console.log({e, v})
    const value = e.target.value
    setSearchInputValue(value)
  }

  /**
   * User selected an ingredient in the dropdown
   *
   * @param {object} e
   */
  const handleClickIngredient = (e) => {
    // e.preventDefault()

    // const uuid = e.target.dataset.uuid
    const { value } = e
    const ingredient = suggestedIngredients.find((d) => d.uuid === value)

    if (ingredient) {
      setSelectedIngredients([...selectedIngredients, ingredient])
      setSuggestedIngredients([])
      setSearchInputValue('')
    }
  }

  /**
   * User removed a selected ingredient
   *
   * @param {object} e
   */
  const handleClickRemoveIngredient = (e) => {
    // const uuid = e.target.dataset.uuid
    const { value } = e
    const ingredient = selectedIngredients.find((d) => d.uuid === value)
    console.log({ ingredient, e })

    if (ingredient) {
      setSelectedIngredients(selectedIngredients.filter((d) => d.uuid !== ingredient.uuid))
    }
  }

  const updateSearchParams = (uuids) => {
    if (useUrl) {
      let searchParams = ''

      if (uuids.length > 0) {
        searchParams = `?${formatArrayQuery(URL_KEY, uuids)}`
      }

      history.push({
        search: searchParams
      })
    }
  }

  /**
   * List of selected ingredients changed
   */
  const handleIngredientsChange = () => {
    const uuids = selectedIngredients.map((ingredient) => ingredient.uuid)
    onChangeIngredients(uuids)

    if (!isEqual(uuids, getSearchParams(URL_KEY))) {
      updateSearchParams(uuids)
    }
  }

  /**
   * Call the API to fetch the suggested ingredients
   */
  useEffect(() => {
    const fetchIngredients = async () => {
      if (searchInputValue.trim().length > 0) {
        const response = await ingredientsService.search(searchInputValue)

        if (isSuccessResponse(response)) {
          const data = getDataFromResponse(response)

          const filtered = data.filter((ingredient) => {
            return !selectedIngredients.some((d) => d.uuid === ingredient.uuid)
          })

          setSuggestedIngredients(filtered)
        }
      } else {
        setSuggestedIngredients([])
      }
    }

    fetchIngredients()
  }, [searchInputValue])

  useEffect(handleIngredientsChange, [selectedIngredients])

  useEffect(() => {
    const { action } = history
    const ingredientsInUrl = getSearchParams(URL_KEY)

    // Browser previous or forward
    if (action === 'POP') {
      const fetchIngredients = async () => {
        if (ingredientsInUrl.length > 0) {
          const response = await ingredientsService.getByUuids(ingredientsInUrl)

          if (isSuccessResponse(response)) {
            const data = getDataFromResponse(response)
            const ingredients = []

            // Keep the same order as the URL
            ingredientsInUrl.forEach((uuid) => {
              const ingredient = data.find((d) => d.uuid === uuid)

              if (ingredient) {
                ingredients.push(ingredient)
              }
            })

            setSelectedIngredients(ingredients)
          }
        } else {
          setSelectedIngredients([])
        }
      }

      fetchIngredients()
    }
    // else if (action === 'PUSH' && ingredientsInUrl.length === 0) {
    //   console.log('HEREEEEE')
    //   setSelectedIngredients([])
    // }
  }, [location])

  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientsInUrl = getSearchParams(URL_KEY)

      if (ingredientsInUrl.length > 0) {
        const response = await ingredientsService.getByUuids(ingredientsInUrl)

        if (isSuccessResponse(response)) {
          const data = getDataFromResponse(response)
          const ingredients = []

          // Keep the same order as the URL
          ingredientsInUrl.forEach((uuid) => {
            const ingredient = data.find((d) => d.uuid === uuid)

            if (ingredient) {
              ingredients.push(ingredient)
            }
          })

          setSelectedIngredients(ingredients)
        }
      }
    }

    fetchIngredients()
  }, [])

  return (
    <div>
      <Autocomplete
        items={suggestedIngredients}
        selectedIngredients={selectedIngredients}
        handleChangeInput={handleChangeInput}
        onSelect={handleClickIngredient}
        onRemove={handleClickRemoveIngredient}
        inputValue={searchInputValue}
        size={size}
      />
    </div>
  )
}

SearchBar.propTypes = {
  onChangeIngredients: PropTypes.func.isRequired,
  useUrl: PropTypes.bool,
  size: PropTypes.string
}

SearchBar.defaultProps = {
  useUrl: false,
  size: 'medium'
}

export default SearchBar
