import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = props => {
  const { items, onSelect } = props

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        padding: '10px',
        background: '#FFF',
        display: (items.length > 0 ? 'block' : 'none')
        }}
      >
        {items.map((ingredient) => (
          <p
            key={ingredient.uuid}
            data-uuid={ingredient.uuid}
            onClick={onSelect}
          >
            {ingredient.name}
          </p>
        ))}
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func
}

Dropdown.defaultProps = {
  items: [],
  onSelect: () => {},
}

export default Dropdown