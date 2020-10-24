import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import isAuthorized from '../middlewares/isAuthorized.js'
import withCatchAsync from '../helpers/withCatchAsync.js'
import { IngredientController } from '../controllers/index.js'

const routesIngredients = express.Router()

routesIngredients.get('/all', isAuthenticated, isAuthorized('admin'), withCatchAsync(IngredientController.all))
routesIngredients.get('/get/:uuid', withCatchAsync(IngredientController.get))
routesIngredients.get('/search', withCatchAsync(IngredientController.search))
routesIngredients.post('/new', isAuthenticated, isAuthorized('admin'), withCatchAsync(IngredientController.new))
routesIngredients.put('/update/:uuid', isAuthenticated, isAuthorized('admin'), withCatchAsync(IngredientController.update))
routesIngredients.delete('/delete/:uuid', isAuthenticated, isAuthorized('admin'), withCatchAsync(IngredientController.delete))

export default routesIngredients
