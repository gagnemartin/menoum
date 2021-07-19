import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Dropdown from './Dropdown'

const Autocomplete = (props) => {
  const { canAddNew, items, onChange, onClickAddNew, onSelect, value } = props

  return (
    <>
      <TextField value={value} onChange={onChange} variant='outlined' data-testid='ingredient-search-input' multiline fullWidth />
      <Dropdown canAddNew={canAddNew} items={items} onClickAddNew={onClickAddNew} onSelect={onSelect} value={value} />
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
