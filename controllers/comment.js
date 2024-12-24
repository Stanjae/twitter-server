import mongoose from "mongoose";
import NewComment from "../models/comment.js";
import NewNotification from "../models/Notification.js";



export const getComments=async(req, res)=>{
    const { tweetId, replyingTo } = req.query;

    try{
        //const count = await NewComment.countDocuments({ tweet: tweetId, replyingTo})
        const comments = await NewComment.find({ tweet: tweetId, replyingTo})
        .populate("author", "fullName username picture _id authType profileId")
        .populate({
            path: 'author',
            populate: { path: 'profileId', select:'profilePicture', model: 'Profile' } // Assuming you have a way to reference Profile in User
        })
        .populate('replyingTo', 'username fullName _id' // Assuming you have a way to reference Profile in User
        ).sort({createdAt: 'descending'});
        if (!comments.length) {
            return res.status(404).json({ msg: 'No posts found for this user' });
        }
        res.json(comments);
    }catch(err){
        res.status(500).json({ msg: 'Server error' });
    }

}

export const addComment =async(req,res)=>{
    const data = req.body;
    try{
        await NewComment.create(data)

        if (data?.replyingTo !== data?.author) {
            // Create a notification for the creator
            const notification = new NewNotification({
              authorId: data?.replyingTo,
              userId:data?.author,
              type: 'comment',
              content: `commented on your tweet`,
              relatedEntityId: data?.tweet,
              entityType: 'Tweet',
            });
      
            await notification.save();
          }
        res.status(201).json({message:"commented sucessfully"})
    }catch(err){
        res.status(500);
    }
}

export const deleteComment =async(req,res)=>{
    const {authorId, commentId} = req.body;

    const existingComment = await NewComment.findOne({author:authorId, _id:commentId});

    if(!existingComment){
        return res.status(400).json({message:"Not commented"})
    }
    try{
        await NewComment.findOneAndDelete({_id:commentId, author:authorId})
        res.status(204).json({message:"Deleted sucessfully"})
    }catch(err){
        res.status(500).json({message:err?.message})
    }
}