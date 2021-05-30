import PropTypes from 'prop-types'
import Style from './style'

const Flexbox = (props) => {
  const { children } = props

  return <Style {...props}>{children}</Style>
}

Style.propTypes = {
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string
}

Style.defaultProps = {
  justifyContent: 'initial',
  alignItems: 'initial'
}

export default Flexbox
