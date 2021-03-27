import PropTypes from 'prop-types'
import Dropdown from './Dropdown'

const Autocomplete = (props) => {
  const { canAddNew, items, onChange, onClickAddNew, onSelect, value } = props

  return (
    <>
      <input type='text' value={value} onChange={onChange} />
      <Dropdown
        canAddNew={canAddNew}
        items={items}
        onClickAddNew={onClickAddNew}
        onSelect={onSelect}
        value={value}
      />
    </>
  )
}

Autocomplete.propTypes = {
  canAddNew: PropTypes.bool,
  items: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onClickAddNew: PropTypes.func,
  onSelect: PropTypes.func,
  value: PropTypes.string.isRequired
}

Autocomplete.defaultProps = {
  canAddNew: false,
  items: [],
  onClickAddNew: () => {},
  onSelect: () => {}
}

export default Autocomplete
