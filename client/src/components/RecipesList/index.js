import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import RecipeItem from './RecipeItem'

const RecipesList = ({ items }) => {
  return (
    <Grid container spacing={{ xs: 3, md: 5 }}>
      {items.map((item) => (
        <Grid item xs={12} md={6} lg={4} key={item.uuid}>
          <RecipeItem item={item} />
        </Grid>
      ))}
    </Grid>
  )
}

RecipesList.propTypes = {
  items: PropTypes.array
}

RecipesList.defaultProps = {
  items: []
}

export default RecipesList
