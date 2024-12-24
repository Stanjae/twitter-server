import mongoose from "mongoose";


const ProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    profilePicture:{
        type: String,
        default: ''
    },
    gender:{
        type: String,
        default: '',
    },
    dob:{
        type: Date,
        default: null // Optional date of birth field
    },
    coverPicture:{
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxLength: 160 // Twitter bio character limit
    },
    location: {
        type: String,
        maxLength: 30 // Optional location field
    },
    website: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v); // URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Compile model from schema
const NewProfile = mongoose.model('Profile', ProfileSchema);
export default NewProfile



 /* email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    }, */