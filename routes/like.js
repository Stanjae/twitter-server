import express from 'express'
import { getLikeCount, isLiked, likeTweet, unLikeTweet } from '../controllers/likes.js';

const likeRouter = express.Router();


likeRouter.get('/like-count/:tweetId', getLikeCount);
likeRouter.post('/add', likeTweet);
likeRouter.delete('/delete', unLikeTweet);
likeRouter.get('/like-status', isLiked)

export default likeRouter