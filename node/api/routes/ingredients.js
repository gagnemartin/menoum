import express from 'express'
import { IngredientController } from '../controllers/index.js'

const routesIngredients = express.Router()

routesIngredients.get('/all', IngredientController.all)
routesIngredients.get('/get/:uuid', IngredientController.get)
routesIngredients.get('/search', IngredientController.search)
routesIngredients.post('/new', IngredientController.new)
routesIngredients.put('/update/:uuid', IngredientController.update)
routesIngredients.delete('/delete/:uuid', IngredientController.delete)

export default routesIngredients
