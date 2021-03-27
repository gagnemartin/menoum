import express from 'express'
import routesIngredients from './ingredients.js'
import routeRecipes from './recipes.js'
import routesUsers from './users.js'

const indexRouter = express.Router()

indexRouter.use('/ingredients', routesIngredients)
indexRouter.use('/recipes', routeRecipes)
indexRouter.use('/users', routesUsers)

export default indexRouter
