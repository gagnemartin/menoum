import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import isAuthorized from '../middlewares/isAuthorized.js'
import withCatchAsync from '../helpers/withCatchAsync.js'
import { RecipeController } from '../controllers/index.js'

const routesRecipes = express.Router()

routesRecipes.get('/all', isAuthenticated, isAuthorized('admin'), withCatchAsync(RecipeController.all))
routesRecipes.get('/get/:uuid', withCatchAsync(RecipeController.get))
routesRecipes.get('/suggest', withCatchAsync(RecipeController.suggest))
routesRecipes.post('/new', isAuthenticated, isAuthorized('user'), withCatchAsync(RecipeController.new))
routesRecipes.put('/update/:uuid', isAuthenticated, isAuthorized('admin'), withCatchAsync(RecipeController.update))
routesRecipes.delete('/delete/:uuid', isAuthenticated, isAuthorized('admin'), withCatchAsync(RecipeController.delete))

export default routesRecipes
