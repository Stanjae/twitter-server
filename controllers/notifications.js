import NewNotification from "../models/Notification.js";


export const getAuthorNotifications =async(req, res)=>{
    const {authorId} = req.params
    try{
        const notifications = await NewNotification.find({ authorId: authorId })
        .populate("userId", "fullName picture _id authType" )
        .populate({
            path: 'userId',
            populate: { path: 'profileId', select:'profilePicture', model: 'Profile' } // Assuming you have a way to reference Profile in User
        })
        .populate({
            path: 'relatedEntityId',
            select:"entityType == User ? fullName _id : entityType == Tweet ? tweet : 'comment'",
        })
        .sort({createdAt: 'descending'});
        res.json(notifications);
    }catch(err){
        res.status(500).json({message:'AN error occured'});
    }

}

export const getUnreadNotificationsCount = async(req, res)=>{
    const {authorId} = req.params;

    try{
        const count = await NewNotification.countDocuments({authorId, isRead:false});
        res.json({count})
    }catch(err){
        res.status(500).json({message:'AN error occured'});
    }
}

export const markAsRead = async(req, res)=>{
    const {notificationId} = req.params;
    try{
        await NewNotification.findByIdAndUpdate(notificationId, {isRead: true}, {new: true});
        res.status(201).json({message:'marked as read'})
    }catch(err){
        res.status(500).json({message:'AN error occured'});
    }
}