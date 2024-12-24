import { io } from "../index.js";
import NewFollow from "../models/follow.js";
import NewNotification from "../models/Notification.js";
import NewUser from "../models/user.js";

export const followAuthor =async(req,res)=>{
    const {authorId, followerId} = req.body;
    try{
        const existingFollow = await NewFollow.findOne({author:authorId, user:followerId})

        if(existingFollow){
            return res.status(400).json({message:"Already following"})
        }

        await NewFollow.create({author:authorId, user:followerId})
        const username = await NewUser.findById(followerId);
        if (authorId !== followerId) {
            // Create a notification for the creator
            const notification = new NewNotification({
              authorId: authorId,
              userId:followerId,
              type: 'follow',
              content: `followed you`,
              relatedEntityId: followerId,
              entityType: 'User',
            });
      
            await notification.save();
            io.to(authorId).emit('receiveNotification', {name: username?.fullName,type:'follow',content: `Followed you` });
          }
        res.status(201).json({message:"followed sucessfully"})
    }catch(err){
        res.status(500).json({message:err?.message})
    }
    
}

export const getAuthorFollowCount =async(req, res)=>{
    const {userId} = req.params
    try{
        const followersCount = await NewFollow.countDocuments({author:userId})
        const followingCount = await NewFollow.countDocuments({user:userId})
        res.json({following:followingCount, followers:followersCount})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

export const unFollowAuthor =async(req,res)=>{
    const {authorId, followerId} = req.body;

    const existingFollow = await NewFollow.findOne({author:authorId, user:followerId})

    if(!existingFollow){
        return res.status(400).json({message:"not following"})
    }
    try{
        await NewFollow.findOneAndDelete({author:authorId, user:followerId})
        res.status(204).json({message:"Unfollowed sucessfully"})
    }catch(err){
        res.status(500).json({message:err?.message})
    }
 
}

export const isFollowing =async(req, res)=>{
    const { authorId, userId } = req.query;

  try {
    const isFollowing = await NewFollow.findOne({ author: authorId, user: userId });
    res.status(200).json({ isFollowing: !!isFollowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}