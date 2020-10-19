import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import isAuthorized from '../middlewares/isAuthorized.js'
import { UserController } from '../controllers/index.js'

const routes = express.Router()

routes.post('/register', UserController.register)
routes.post('/login', UserController.login)
routes.post('/logout', UserController.logout)
routes.post('/refresh', isAuthenticated, UserController.refresh)

export default routes
