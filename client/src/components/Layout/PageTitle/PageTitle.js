import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const PageTitle = ({ textAlign, children }) => {
  return (
    <Typography variant='h4' component='h1' textAlign={textAlign} fontWeight='bold'>
      {children}
    </Typography>
  )
}

PageTitle.propTypes = {
  textAlign: PropTypes.oneOf(['center', 'left', 'right'])
}

PageTitle.defaultProps = {
  textAlign: 'center'
}

export default PageTitle
