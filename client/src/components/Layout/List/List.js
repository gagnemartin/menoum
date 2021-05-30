import PropTypes from 'prop-types'
import { ListUl, ListOl, ListItem } from './style'

const Ul = (props) => {
  const { children, inline, 'data-testid': testId } = props
  const style = {
    ...props
  }

  if (inline) {
    style.display = 'flex'
  }

  return (
    <ListUl data-testid={testId} {...style}>
      {children}
    </ListUl>
  )
}

const Ol = (props) => {
  const { children, inline, 'data-testid': testId } = props
  const style = {
    ...props
  }

  if (inline) {
    style.display = 'flex'
  }

  return (
    <ListOl data-testid={testId} {...style}>
      {children}
    </ListOl>
  )
}

const Item = (props) => {
  const { children } = props
  return <ListItem {...props}>{children}</ListItem>
}

Ul.propTypes = {
  listStyle: PropTypes.string,
  inline: PropTypes.bool,
  'data-testid': PropTypes.string
}

Ul.defaultTypes = {
  listStyle: 'disc',
  inline: false,
  'data-testid': 'list-ul'
}

Ol.propTypes = {
  listStyle: PropTypes.string,
  inline: PropTypes.bool,
  'data-testid': PropTypes.string
}

Ol.defaultTypes = {
  listStyle: 'decimal',
  inline: false,
  'data-testid': 'list-ol'
}

export default {
  Ul,
  Ol,
  Item
}
