import PropTypes from 'prop-types'

const IngredientsList = props => {
  const { handleRemove, items } = props

  return (
    <div style={{ margin: '10px' }}>
      {items.map((ingredient) => (
        <span
          key={ingredient.uuid}
          data-testid={`selected-ingredient-${ingredient.uuid}`}
          style={{
            border: 'solid 1px lightgray',
            marginRight: '10px',
            padding: '5px'
          }}
        >
          {ingredient.name}
          <button
            onClick={handleRemove}
            data-uuid={ingredient.uuid}
            style={{ marginLeft: '10px' }}
            data-testid={`selected-ingredient-remove-${ingredient.uuid}`}
          >
            X
          </button>
        </span>
      ))}
    </div>
  )
}

IngredientsList.propTypes = {
  handleRemove: PropTypes.func.isRequired,
  items: PropTypes.array
}

IngredientsList.defaultProps = {
  items: []
}

export default IngredientsList