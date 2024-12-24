import express from 'express'
import { getTrends } from '../controllers/trends.js'

const trendRouter = express.Router()

trendRouter.get('/', getTrends)


export default trendRouter