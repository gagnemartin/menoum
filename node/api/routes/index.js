import express from 'express'
import routesIngredients from './ingredients.js'
import routeRecipes from './recipes.js'

const indexRouter = express.Router()

indexRouter.use('/ingredients', routesIngredients)
indexRouter.use('/recipes', routeRecipes)

export default indexRouter
