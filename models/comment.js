import mongoose from "mongoose";


const CommentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    tweet:{type:mongoose.Schema.ObjectId, ref:"Tweet", required:true},
    comment:{type:String, required:true},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    replyingTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    }
}
)
   
// Compile model from schema
const NewComment = mongoose.model('Comment', CommentSchema);
export default NewComment;