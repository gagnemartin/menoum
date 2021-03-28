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
          <p onClick={onClickAddNew}>
            Add <b>{value}</b>
          </p>
        )}
        {items.map((ingredient) => (
          <p key={ingredient.uuid} data-uuid={ingredient.uuid} onClick={onSelect} data-testid='ingredient-dropdown-item'>
            {ingredient.name}
          </p>
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
