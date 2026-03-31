const notificationService = require('../services/notificationService');

class NotificationController {
    // GET /api/notifications/
    async getMyNotifications(req, res) {
        try {
            const notifications = await notificationService.getByUserId(req.user.userId);
            res.status(200).json(notifications);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET /api/notifications/unread-count
    async getUnreadCount(req, res) {
        try {
            const count = await notificationService.getUnreadCount(req.user.userId);
            res.status(200).json({ count });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // PATCH /api/notifications/:id/read
    async markAsRead(req, res) {
        try {
            const notification = await notificationService.markAsRead(req.params.id, req.user.userId);
            res.status(200).json(notification);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PATCH /api/notifications/read-all
    async markAllAsRead(req, res) {
        try {
            await notificationService.markAllAsRead(req.user.userId);
            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // DELETE /api/notifications/:id
    async delete(req, res) {
        try {
            await notificationService.delete(req.params.id, req.user.userId);
            res.status(200).json({ message: 'Notification deleted' });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new NotificationController();