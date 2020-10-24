import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import indexRouter from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js'
import AppError from './helpers/AppError.js'

const __dirname = path.resolve()

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', indexRouter)
app.all('*', (req, res, next) => {
  next(new AppError(404))
})
app.use(errorHandler)

export default app
