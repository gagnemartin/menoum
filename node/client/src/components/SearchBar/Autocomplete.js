import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from './Dropdown'

const Autocomplete = props => {
  const { onChange, items, onSelect, value } = props

  return (
    <>
      <input type='text' value={value} onChange={onChange} />
      <Dropdown onSelect={onSelect} items={items} />
    </>
  )
}

Autocomplete.propTypes = {
  onChange: PropTypes.string.isRequired,
  items: PropTypes.array,
  onSelect: PropTypes.func,
  value: PropTypes.func.isRequired
}

Autocomplete.defaultProps = {
  items: [],
  onSelect: () => {},
}

export default Autocomplete