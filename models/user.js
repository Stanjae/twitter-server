import mongoose from "mongoose";
import NewProfile from "./profile.js";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,     
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    picture:{
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
        required: true,
        unique:true
    },
    username:{
        type: String,
        default: '',
        required: true,
    },
    password:{
        type:String,
        default:''
    },
    authType:{
        type: String,
        default: 'google',
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile", // Reference to the Profile model
    },
})

userSchema.post('save', async function (doc, next) {
    try {
      // Check if a profile already exists for the user
      const existingProfile = await NewProfile.findOne({ userId: doc._id });
      if (!existingProfile) {
        // Create a new profile
        const profile = await NewProfile.create({ userId: doc._id });
        await NewUser.findOneAndUpdate({_id:doc?._id}, {profileId:profile._id}, {new:true})
      }
      next();
    } catch (error) {
      next(error);
    }
});

const NewUser = mongoose.model("User", userSchema);

export default NewUser;