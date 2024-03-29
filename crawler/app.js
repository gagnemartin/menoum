import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler.js'
import indexRouter from './routes/index.js'

const __dirname = path.resolve()

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', indexRouter)
app.all('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
app.use(errorHandler)

export default app
