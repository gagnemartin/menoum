import express from 'express'
import { RecipeController } from '../controllers/index.js'

const routesRecipes = express.Router()

routesRecipes.get('/all', RecipeController.all)
routesRecipes.get('/get/:uuid', RecipeController.get)
routesRecipes.post('/new', RecipeController.new)
routesRecipes.put('/update/:uuid', RecipeController.update)
routesRecipes.delete('/delete/:uuid', RecipeController.delete)

export default routesRecipes
