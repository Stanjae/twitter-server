import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Creator receiving the notification
  type: { type: String, required: true }, // e.g., 'like', 'comment', 'follow', 'tweet
  content: { type: String, required: true }, // Message content
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'entityType' }, // e.g., Post or Comment ID
  entityType: { type: String, enum: ['Tweet', 'Comment', 'User'], required: true }, // Entity type
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const NewNotification = mongoose.model('Notification', notificationSchema);
export default NewNotification;
