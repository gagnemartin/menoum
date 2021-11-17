import express from 'express'
import withCatchAsync from '../helpers/withCatchAsync.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import isAuthorized from '../middlewares/isAuthorized.js'
import CrawlController from '../controllers/CrawlController.js'

const controller = CrawlController()
const router = express.Router()

// router.get('/crawl', controller.crawl)
router.get('/crawl', isAuthenticated, isAuthorized('admin'), withCatchAsync(controller.crawl))

export default router
