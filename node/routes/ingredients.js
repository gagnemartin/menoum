import express from 'express'
import { IngredientController } from '../controllers/index.js'

const routesIngredients = express.Router()

routesIngredients.get('/all', IngredientController.all)
routesIngredients.get('/get/:uuid', IngredientController.get)

export default routesIngredients
