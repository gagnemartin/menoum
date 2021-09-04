import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { ProtectedLink } from '../Protected'

const RecipeItem = (props) => {
  const { item } = props

  return (
    <Card data-testid='recipe-list-item' sx={{ minWidth: '100%' }}>
      <CardMedia
        sx={{
          height: 0,
          paddingTop: '56.25%' // 16:9
        }}
        image={item.thumbnail}
        title={item.name}
      />
      <CardContent>
        <p style={{ margin: '0' }}>{item.name}</p>
      </CardContent>
      <CardActions>
        <ProtectedLink role='admin' to={`/recipe/edit/${item.uuid}`}>
          Edit
        </ProtectedLink>
      </CardActions>
    </Card>
  )
}

RecipeItem.propTypes = {
  item: PropTypes.object
}

RecipeItem.defaultProps = {
  item: {}
}

export default RecipeItem
