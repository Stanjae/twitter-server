import mongoose from "mongoose";
import NewTrends from "./trends.js";
import {extractHashtags, extractPhrases} from '../utils/nlp.js'


const tweetSchema = mongoose.Schema({
    tweet: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number,
        default: 1,
    },
    images:{
        type: Array,
        default: [],
    },
    retweets: {
        type: Number,
        default: 0,
    }
})

 tweetSchema.post('save', async function (doc, next) {
    try {
        // Extract hashtags and phrases
        const hashtags = extractHashtags(doc.tweet);
        const phrases = extractPhrases(doc.tweet);
        // Update trending topics
        const updateTopic = async (topic, type) => {
            const ryu = await NewTrends.findOneAndUpdate(
            { topic, type },
            { $inc: { count: 1 }, $set: { lastUpdated: new Date() } },
            { upsert: true, new: true }
            );
        };
        for (const hashtag of hashtags) await updateTopic(hashtag, 'hashtag');
        for (const phrase of phrases) await updateTopic(phrase, 'phrase');
      next();
    } catch (error) {
      console.log('errp:', error)
      next(error);
    }
})

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;


/* // routes/tweet.js
const express = require('express');
const Tweet = require('../models/Tweet');
const TrendingTopic = require('../models/TrendingTopic');
const { extractHashtags, extractPhrases } = require('../utils/nlp');

const router = express.Router();

// POST /api/tweets
router.post('/', async (req, res) => {
  const { userId, content } = req.body;

  if (!content) return res.status(400).json({ error: 'Content is required' });

  try {
    // Save the tweet
    const tweet = await Tweet.create({ userId, content });

    // Extract hashtags and phrases
    const hashtags = extractHashtags(content);
    const phrases = extractPhrases(content);

    // Update trending topics
    const updateTopic = async (topic, type) => {
      await TrendingTopic.findOneAndUpdate(
        { topic, type },
        { $inc: { count: 1 }, $set: { lastUpdated: new Date() } },
        { upsert: true, new: true }
      );
    };

    for (const hashtag of hashtags) await updateTopic(hashtag, 'hashtag');
    for (const phrase of phrases) await updateTopic(phrase, 'phrase');

    res.status(201).json({ message: 'Tweet posted successfully', tweet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
 */