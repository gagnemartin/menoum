import React from 'react'
import PropTypes from 'prop-types'
import RecipeItem from './RecipeItem'

const RecipesList = props => {
  const { items } = props

  return (
    <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          columnGap: '20px',
        }}
      >
        {items.map((item) => (
          <RecipeItem item={item} />
        ))}
      </div>
  )
}

RecipesList.propTypes = {
  items: PropTypes.array
}

RecipesList.defaultProps = {
  items: []
}

export default RecipesList