import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'

const DropdownWrapper = styled(Paper)((props) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  padding: '10px',
  display: props.display
}))

const Dropdown = (props) => {
  const { canAddNew, items, onClickAddNew, onSelect, value } = props

  return (
    <div style={{ position: 'relative' }}>
      <DropdownWrapper display={value.trim().length > 0 ? 'block' : 'none'}>
        {canAddNew && (
          <Link component='button' onClick={onClickAddNew} data-testid='ingredient-dropdown-add-new'>
            Add <b>{value}</b>
          </Link>
        )}
        {items.map((ingredient) => (
          <Link
            component='button'
            key={ingredient.uuid}
            data-uuid={ingredient.uuid}
            onClick={onSelect}
            data-testid='ingredient-dropdown-item'
          >
            {ingredient.name}
          </Link>
        ))}
      </DropdownWrapper>
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
