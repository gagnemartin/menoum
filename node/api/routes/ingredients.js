import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import isAuthorized from '../middlewares/isAuthorized.js'
import { IngredientController } from '../controllers/index.js'

const routesIngredients = express.Router()

routesIngredients.get('/all', IngredientController.all)
routesIngredients.get('/get/:uuid', IngredientController.get)
routesIngredients.get('/search', IngredientController.search)
routesIngredients.post(
  '/new',
  isAuthenticated,
  isAuthorized('admin'),
  IngredientController.new
)
routesIngredients.put(
  '/update/:uuid',
  isAuthenticated,
  isAuthorized('admin'),
  IngredientController.update
)
routesIngredients.delete(
  '/delete/:uuid',
  isAuthenticated,
  isAuthorized('admin'),
  IngredientController.delete
)

export default routesIngredients
