import { io } from "../index.js";
import NewLike from "../models/like.js";
import NewNotification from "../models/Notification.js";
import Tweet from "../models/tweets.js";
import NewUser from "../models/user.js";


export const likeTweet =async(req,res)=>{
    const {tweetId, userId, authorId} = req.body;
    try{
        const existingLike = await NewLike.findOne({userId, tweetId})

        if(existingLike){
            return res.status(400).json({message:"Already Liked"})
        }
        await NewLike.create({userId, tweetId});
        const username = await NewUser.findById(userId);
        if (authorId !== userId) {
            // Create a notification for the creator
            const notification = new NewNotification({
              authorId: authorId,
              userId:userId,
              type: 'like',
              content: `Liked your tweet.`,
              relatedEntityId: tweetId,
              entityType: 'Tweet',
            });
      
            await notification.save();
            io.to(authorId).emit('receiveNotification', {name: username?.fullName,type:'like',content: `Liked your tweet.` });
          }

          
        res.status(201).json({message:"liked sucessfully"})
    }catch(err){
        res.status(500).json({message:err?.message})
    }
    
}

export const getLikeCount =async(req, res)=>{
    const {tweetId} = req.params
    try{
        const LikeCount = await NewLike.countDocuments({tweetId})
        res.json({count:LikeCount})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

export const unLikeTweet =async(req,res)=>{
    const {tweetId, userId} = req.body;
    
    const existingLike = await NewLike.findOne({userId, tweetId})

    if(!existingLike){
        return res.status(400).json({message:"not found"})
    }
    try{
        await NewLike.findOneAndDelete({tweetId, userId})
        res.status(204).json({message:"Unliked sucessfully"})
    }catch(err){
        res.status(500).json({message:err?.message})
    }
 
}

export const isLiked =async(req, res)=>{
    const { userId, tweetId } = req.query;
  try {
    const isLiked = await NewLike.findOne({ tweetId, userId });
    res.status(200).json({ isLiked: !!isLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}