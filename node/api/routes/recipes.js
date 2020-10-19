import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import isAuthorized from '../middlewares/isAuthorized.js'
import { RecipeController } from '../controllers/index.js'

const routesRecipes = express.Router()

routesRecipes.get('/all', RecipeController.all)
routesRecipes.get('/get/:uuid', RecipeController.get)
routesRecipes.get('/suggest', RecipeController.suggest)
routesRecipes.post(
  '/new',
  isAuthenticated,
  isAuthorized('admin'),
  RecipeController.new
)
routesRecipes.put(
  '/update/:uuid',
  isAuthenticated,
  isAuthorized('admin'),
  RecipeController.update
)
routesRecipes.delete(
  '/delete/:uuid',
  isAuthenticated,
  isAuthorized('admin'),
  RecipeController.delete
)

export default routesRecipes
