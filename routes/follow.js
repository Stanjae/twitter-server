import express from 'express'
import { followAuthor, unFollowAuthor,  getAuthorFollowCount, isFollowing} from '../controllers/follow.js';

const followRouter = express.Router()




followRouter.get('/all-follows');
followRouter.post('/create', followAuthor)
followRouter.get('/get-author-stats/:userId', getAuthorFollowCount)
followRouter.get('/is-following', isFollowing)
followRouter.delete('/delete', unFollowAuthor)

export default followRouter