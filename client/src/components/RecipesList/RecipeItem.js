import PropTypes from 'prop-types'
import ProtectedLink from '../App/ProtectedLink'

const RecipeItem = (props) => {
  const { item } = props

  return (
    <div>
      <img src={item.thumbnail} width='100%' alt={item.name} />
      <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <p style={{ margin: '0' }}>{item.name}</p>
        <ProtectedLink role='admin' to={`/recipe/edit/${item.uuid}`}>
          Edit
        </ProtectedLink>
      </div>
    </div>
  )
}

RecipeItem.propTypes = {
  item: PropTypes.object
}

RecipeItem.defaultProps = {
  item: {}
}

export default RecipeItem
