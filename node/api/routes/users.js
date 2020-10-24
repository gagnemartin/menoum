import express from 'express'
import withCatchAsync from '../helpers/withCatchAsync.js'
import { UserController } from '../controllers/index.js'
const routes = express.Router()

routes.post('/register', withCatchAsync(UserController.register))
routes.post('/login', withCatchAsync(UserController.login))
routes.post('/logout', withCatchAsync(UserController.logout))
routes.post('/refresh', withCatchAsync(UserController.refresh))

export default routes
