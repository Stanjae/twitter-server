import mongoose from "mongoose";


const LikeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet", // Reference to the User model
        required: true
    },

}
)
   
// Compile model from schema
const NewLike = mongoose.model('Like', LikeSchema);
export default NewLike;