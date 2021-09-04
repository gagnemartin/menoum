import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'

const PageContainer = ({ maxWidth, children, ...props }) => {
  return (
    <Container {...props} maxWidth={maxWidth}>
      {children}
    </Container>
  )
}

PageContainer.propTypes = {
  maxWidth: PropTypes.string
}

PageContainer.defaultProps = {
  maxWidth: 'lg'
}

export default PageContainer
