import express from 'express'
import routesIngredients from './ingredients.js'

const indexRouter = express.Router()

indexRouter.use('/ingredients', routesIngredients)

export default indexRouter
