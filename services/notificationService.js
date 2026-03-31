const Notification = require('../models/Notification');
const Vacancy = require('../models/Vacancy')
const User = require('../models/User')

class NotificationService {
    async create(userId, type, title, message, data = {}) {
        return await Notification.create({
            userId,
            type,
            title,
            message,
            data
        });
    }

    async getByUserId(userId, limit = 20) {
        return await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit
        });
    }

    async getUnreadCount(userId) {
        return await Notification.count({
            where: { userId, isRead: false }
        });
    }

    async markAsRead(id, userId) {
        const notification = await Notification.findOne({
            where: { id, userId }
        });
        if (notification) {
            await notification.update({
                isRead: true,
                readAt: new Date()
            });
        }
        return notification;
    }

    async markAllAsRead(userId) {
        await Notification.update(
            { isRead: true, readAt: new Date() },
            { where: { userId, isRead: false } }
        );
    }

    async delete(id, userId) {
        return await Notification.destroy({
            where: { id, userId }
        });
    }
}

module.exports = new NotificationService();