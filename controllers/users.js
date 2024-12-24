import "dotenv/config";
import NewUser from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import NewProfile from "../models/profile.js";
import mongoose from "mongoose";
import NewFollow from "../models/follow.js";

const female = 'https://api.dicebear.com/9.x/adventurer/svg?seed=jamie&flip=true&backgroundType=gradientLinear&mouth=variant20,variant13,variant14,variant15,variant16,variant17,variant18,variant19,variant23,variant22,variant21,variant24,variant25,variant26,variant27,variant28,variant29,variant30,variant12,variant11,variant10,variant09,variant08,variant07,variant06,variant05,variant04,variant03,variant02,variant01&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
const male = 'https://api.dicebear.com/9.x/adventurer/svg?seed=Easton&flip=true&backgroundType=gradientLinear&mouth=variant20,variant13,variant14,variant15,variant16,variant17,variant18,variant19,variant23,variant22,variant21,variant24,variant25,variant26,variant27,variant28,variant29,variant30,variant12,variant11,variant10,variant09,variant08,variant07,variant06,variant05,variant04,variant03,variant02,variant01&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'


export const googleAuthenticate =async(req, res)=>{
    const {access_token} = req.body
    let user;
  
   const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${access_token}`,
    },
 
   })
    const userinfo = await userResponse.json()
    user = await NewUser.findOne({email: userinfo.email})
    if(!user){
        user = new NewUser({
            email: userinfo.email,
            fullName: userinfo.name,
            picture: userinfo.picture,
            username: userinfo.email?.split('@')?.at(0),
        });
        await user.save()
    }
    const jwtToken = jwt.sign({id:user?._id}, process.env.JWT_SECRET, {expiresIn:'2h'})
    res.json({token: jwtToken, user})
}


export const emailLogin =async(req, res)=>{
    const { formData:{email, password} } = req.body;
    
    try{
        const user = await NewUser.findOne({ email });
        if (!user) return res.status(400).send('Invalid credentials');
    
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invvalid Password');
    
        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({token: jwtToken, user, message:"User Logged in Sucessfully"})
    }catch(err){
        return res.status(500).json({message:"Something went wrong"});
    }
   
}

export const emailSignUp =async(req, res)=>{
    const {formData} = req.body;
    let user;

    try{
        user = await NewUser.findOne({email: formData?.email})
        if(user){
            return res.status(400).json({statusText:"Account already exists"});
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(formData?.password, salt);
    
        const newAccount = {username:formData?.email?.split('@')?.at(0), email:formData?.email, password:hashedPassword,
            authType:"email", fullName:formData?.username
        }
    
        let newUser = new NewUser(newAccount)
        await newUser.save();

        const jwtToken = jwt.sign({id:newUser?._id}, process.env.JWT_SECRET, {expiresIn:'2h'})

        res.status(201).json({token: jwtToken, user:newUser, message:"User registered Sucessfully"})
    }catch(err){
        return res.status(500).json({message:"Something went wrong"});
        
    }
}


export const completeProfile =async(req, res)=>{
    let {formData} = req.body;
    if(!mongoose.Types.ObjectId.isValid(formData?.userId)) {  
        return res.status(404).json({message:"Post with Id doesnt exist"})
    }

    if(formData.profilePicture == ''){
        formData.profilePicture = (formData.gender === 'female')? female : male;
    }
    try{
        await NewProfile.findOneAndUpdate({userId:formData?.userId}, formData, {new:true})
        return res.status(201).json({message:"Updated Sucessfully"})
    }catch(err){
        res.status(400).json({message: err.message});
    }
}


//getCurrentUserProfile

export const getCurrentUserProfile =async(req, res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {  
        return res.status(404).json({message:"Profile with Id doesnt exist"})
    }
    try{
        const profile = await NewProfile.findOne({userId:id}).populate("userId", "email _id username picture authType fullName")
        return res.status(200).json({profile:profile})
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

//getusers

export const getAllUsers =async(req, res)=>{
    try{

    }catch(err){
        res.status(400).json({message: err.message});
    }
}

export const  getSomeUsers =async(req,res)=>{
    const {currentUserId, limit, skip} = req.query
    try{
        const followedUsers = await NewFollow.find({user:currentUserId});

        const followedUsersId = followedUsers.map((item)=> item?.author);

        const users = await NewUser.find({_id:{$nin:[...followedUsersId, currentUserId]}}, "username authType profileId picture fullName _id")
        .populate("profileId", "profilePicture bio").limit(Number(limit))
        .skip(Number(skip));
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

export const getSearchUsers =async(req,res)=>{
    const {query} = req.query
    try{
        const users = await NewUser.aggregate([
            {
              $lookup: {
                from: 'profiles', // Name of the Profile collection
                localField: 'profileId', // Field in Tweet that references User
                foreignField: '_id', // Field in User collection (usually '_id')
                as: 'profileId', // This will add a new field with the user details
              },
            },
            {
              $unwind: '$profileId', // Flatten the authorDetails array
            },
            {
              $match: {
                $or: [
                  { 'username': { $regex: query, $options: 'i' } }, // Search by username
                  { fullName: { $regex: query, $options: 'i' } }, // Search by tweet content
                ],
              },
            },
            // Project the desired fields username authType profileId picture fullName _id
        {
          $project: {
            username: 1,
            authType: 1,
            '_id': 1,
            'picture': 1,
            'fullName': 1,
            'profileId.profilePicture': 1,
            'profileId.bio': 1,
          },
        },
          ]);
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}