import express from 'express'
import { createTweet, getTweets, getSearchTweets, updateTweet, getUserTweets, deleteTweet, getTweetDetail} from '../controllers/tweets.js';

const router = express.Router()


router.get('/', getTweets);
router.post('/create', createTweet)
router.get('/status/:id', getTweetDetail)
router.patch('/update/:id', updateTweet)
router.delete('/delete/:id', deleteTweet)
router.get('/userposts/:id', getUserTweets)
router.get('/searchposts', getSearchTweets)

export default router