import express from 'express'
import { getAuthorNotifications, getUnreadNotificationsCount, markAsRead } from '../controllers/notifications.js'

const notifyRouter = express.Router()

notifyRouter.get('/get-notifications/:authorId', getAuthorNotifications);

notifyRouter.get('/unread-count/:authorId', getUnreadNotificationsCount);

notifyRouter.patch('/mark-read/:notificationId', markAsRead)

export default notifyRouter