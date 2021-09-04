import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { difference } from 'lodash'
import MuiAutocomplete from '@material-ui/core/Autocomplete'
import Chip from '@material-ui/core/Chip'
import CancelIcon from '@material-ui/icons/Cancel'

const Autocomplete = (props) => {
  const { canAddNew, items, handleChangeInput, onSelect, inputValue, selectedIngredients, onRemove } = props

  const formatValues = (data) => {
    return data.map((item) => ({ name: item.name, value: item.uuid }))
  }

  const options = formatValues(items)
  const selectedOptions = formatValues(selectedIngredients)

  if (canAddNew && inputValue.trim().length > 0) {
    options.unshift({ name: `Add ${inputValue}`, value: inputValue })
  }

  /**
   * Selected values changed
   * @param {Object} e Event
   * @param {Array} v Array of selected options
   */
  const handleChangeSelected = (e, v) => {
    if (v) {
      if (v < selectedOptions && !canAddNew) {
        const removed = difference(selectedOptions, v)
        console.log({ removed })
        onRemove(removed[0])
      } else {
        let selected = {}
        if (canAddNew) {
          selected = v
        } else {
          selected = difference(v, selectedOptions)[0]
        }
        console.log({ v, selectedOptions, selected })
        onSelect(selected)
      }
    }
  }

  return (
    <>
      <MuiAutocomplete
        openOnFocus
        multiple={!canAddNew}
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='outlined'
            onChange={handleChangeInput}
            inputProps={{
              ...params.inputProps,
              type: 'search',
              'data-testid': 'ingredient-search-input'
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Typography data-testid={`ingredient-dropdown-item-${option.value}`} noWrap>
              {option.name}
            </Typography>
          </li>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant='outlined'
              label={option.name}
              {...getTagProps({ index })}
              data-testid={`selected-ingredient-${option.value}`}
              deleteIcon={<CancelIcon data-testid={`selected-ingredient-remove-${option.value}`} />}
            />
          ))
        }
        getOptionLabel={(option) => option.name || ''}
        onChange={handleChangeSelected}
        popupIcon={null}
        autoHighlight
        inputValue={inputValue}
        value={selectedOptions}
      />
    </>
  )
}

Autocomplete.propTypes = {
  canAddNew: PropTypes.bool,
  items: PropTypes.array,
  handleChangeInput: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  inputValue: PropTypes.string.isRequired,
  selectedIngredients: PropTypes.array
}

Autocomplete.defaultProps = {
  canAddNew: false,
  items: [],
  onSelect: () => {},
  selectedIngredients: []
}

export default Autocomplete
