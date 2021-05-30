import PropTypes from 'prop-types'

const Dropdown = (props) => {
  const { canAddNew, items, onClickAddNew, onSelect, value } = props

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          padding: '10px',
          background: '#FFF',
          display: value.trim().length > 0 ? 'block' : 'none'
        }}
      >
        {canAddNew && (
          <a href='#' onClick={onClickAddNew} data-testid='ingredient-dropdown-add-new'>
            Add <b>{value}</b>
          </a>
        )}
        {items.map((ingredient) => (
          <a href='#' key={ingredient.uuid} data-uuid={ingredient.uuid} onClick={onSelect} data-testid='ingredient-dropdown-item'>
            {ingredient.name}
          </a>
        ))}
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  canAddNew: PropTypes.bool,
  items: PropTypes.array,
  onClickAddNew: PropTypes.func,
  onSelect: PropTypes.func,
  value: PropTypes.string
}

Dropdown.defaultProps = {
  canAddNew: false,
  items: [],
  onClickAddNew: () => {},
  onSelect: () => {},
  value: ''
}

export default Dropdown
