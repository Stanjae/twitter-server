import mongoose from "mongoose";
import Tweet from "../models/tweets.js";
import NewFollow from "../models/follow.js";
import NewNotification from "../models/Notification.js";
import { io } from "../index.js";
import NewUser from "../models/user.js";

export const getTweets =async(req, res)=>{
    // Fetch tweets from the API
    // Return the fetched tweets
    try{
        const tweets = await Tweet.find().populate("author", "fullName username picture _id authType" )
        .populate({
            path: 'author',
            populate: { path: 'profileId', select:'profilePicture', model: 'Profile' } // Assuming you have a way to reference Profile in User
        })
        .sort({createdAt: 'descending'})
        res.status(200).json(tweets);
    }catch(err){
        console.log(err)
    }
};

export const getSearchTweets =async(req, res)=>{
    const { query } = req.query;

    try {
        const tweets = await Tweet.aggregate([
          {
            $lookup: {
              from: 'users', // Name of the User collection
              localField: 'author', // Field in Tweet that references User
              foreignField: '_id', // Field in User collection (usually '_id')
              as: 'author', // This will add a new field with the user details
            },
          },
          {
            $unwind: '$author', // Flatten the authorDetails array
          },
          {
            $lookup: {
              from: 'profiles', // Name of the Profile collection
              localField: 'author.profileId', // Field in User that references Profile
              foreignField: '_id', // Field in Profile collection
              as: 'profileId', // Output array field
            },
          },
          {
            $unwind: '$profileId', // Flatten the profileDetails array
          },
          {
            $addFields: {
              'author.profileId': '$profileId', // Nest profileDetails into authorDetails
            },
          },
          {
            $match: {
              $or: [
                { 'author.fullName': { $regex: query, $options: 'i' } }, // Search by fullName
                { 'author.username': { $regex: query, $options: 'i' } }, // Search by username
                { tweet: { $regex: query, $options: 'i' } }, // Search by tweet content
              ],
            },
          },
          // Project the desired fields
      {
        $project: {
          tweet: 1,
          createdAt: 1,
          'author._id': 1,
          'author.username': 1,
          'author.fullName': 1,
          'author.picture': 1,
          'author.authType': 1,
          'author.profileId.profilePicture': 1,
          'author.profileId._id':1,
          'views':1
        },
      },
        ]);
    
        res.json(tweets);
      } catch (err) {
        res.status(500).json({ message: 'Error searching tweets' });
      }
}

export const getUserTweets =async(req,res)=>{
    try {
        const tweets = await Tweet.find({ author: req.params.id })
        .populate("author", "fullName username picture _id authType" )
        .populate({
            path: 'author',
            populate: { path: 'profileId', select:'profilePicture', model: 'Profile' } // Assuming you have a way to reference Profile in User
        })
        .sort({createdAt: 'descending'});
        if (!tweets.length) {
            return res.status(404).json({ msg: 'No posts found for this user' });
        }
        res.json(tweets);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}

export const getTweetDetail=async(req, res)=>{
    const {id} = req.params;
    try{
        const tweet = await Tweet.findByIdAndUpdate(id, { $inc: { views: 1 } }, {new:true}).populate("author", "fullName username picture _id authType")
        .populate({
            path: 'author',
            populate: { path: 'profileId', select:'profilePicture', model: 'Profile' } // Assuming you have a way to reference Profile in User
        })
        res.status(200).json(tweet);
    }catch(err){
        console.log("err:", err)
        res.status(400).json({message: err.message});
    }

}

export const createTweet=async(req, res)=>{
    const newTweet = req.body;
    const tweet = new Tweet(newTweet);

    const followers = await NewFollow.find({author:newTweet?.author})
    const username = await NewUser.findById(newTweet?.author);
    const notifications = followers.map((follower) => ({
      authorId: follower?.user,
      userId:follower?.author,
      type: 'tweet',
      content: `created a post`,
      relatedEntityId: tweet?._id,
      entityType: 'Tweet',
    }));

    try{
        const savedTweet = await tweet.save();
        await NewNotification.insertMany(notifications);

        followers.forEach((follower) => {
          io.to(follower.user).emit('receiveNotification', {
            name: username?.fullName,
            type:'tweet',
            content: `created a post` 
          });
        });
        res.status(201).json(savedTweet);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

export const updateTweet=async(req, res)=>{
    const {id} = req.params;
    const newTweet = req.body;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {  
        console.log("being:")
        return res.status(404).json({message:"Post with Id doesnt exist"})
    }
    try{
        const updatedTweet = await Tweet.findByIdAndUpdate(id, newTweet, {new:true})
        console.log("miracle", updatedTweet)
        res.status(203).json(updatedTweet)
    }catch(err){
        console.log("err:", err)
        res.status(400).json({message: err.message});
    }
    
    
}

export const deleteTweet=async(req, res)=>{
    const {id} = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {  
        return res.status(404).json({message:"Post with Id doesnt exist"})
    }
    try{
        await Tweet.findByIdAndDelete(id)
        res.status(204).json({message:"Tweet deleted Sucessfully"})
    }catch(err){
        console.log("err:", err)
        res.status(400).json({message: err.message});
    }
    
    
}