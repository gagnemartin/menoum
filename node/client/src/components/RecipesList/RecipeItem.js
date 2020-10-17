import React from 'react'
import PropTypes from 'prop-types'

const RecipeItem = (props) => {
  const { item } = props

  return (
    <div>
      <img src={item.thumbnail} width='100%' alt={item.name} />
      <p>{item.name}</p>
    </div>
  )
}

RecipeItem.propTypes = {
  item: PropTypes.object
}

RecipeItem.defaultProps = {
  item: {}
}

export default RecipeItem
