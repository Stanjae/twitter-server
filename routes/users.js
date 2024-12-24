import express from 'express'
const userRouter = express.Router()
import { emailLogin, emailSignUp, getSearchUsers, googleAuthenticate, getAllUsers, getSomeUsers, completeProfile,getCurrentUserProfile } from '../controllers/users.js';



//auth route
userRouter.post("/google", googleAuthenticate);

 // Email route
userRouter.post("/login", emailLogin);

userRouter.post("/signup", emailSignUp);

userRouter.post("/complete-profile", completeProfile)

userRouter.get("/get-profile/:id", getCurrentUserProfile)

userRouter.get("/getusers", getAllUsers)

userRouter.get('/get-some-users', getSomeUsers)

userRouter.get('/search', getSearchUsers)





export default userRouter