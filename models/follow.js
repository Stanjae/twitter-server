import mongoose from "mongoose";


const FollowSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },

}
)
   
// Compile model from schema
const NewFollow = mongoose.model('Follow', FollowSchema);
export default NewFollow