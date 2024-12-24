import express from 'express'
import { addComment, deleteComment, getComments } from '../controllers/comment.js'

const commentRouter = express.Router()

commentRouter.post('/add', addComment)
commentRouter.get('/get-comments', getComments)
commentRouter.delete('/delete', deleteComment)

export default commentRouter;