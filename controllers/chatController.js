const chatService = require('../services/chatService');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

class ChatController {
    // GET /api/chats
    async getMyChats(req, res) {
        try {
            const chats = await chatService.getUserChats(req.user.userId, req.user.role);
            res.status(200).json(chats);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET /api/chats/:id/messages
    async getMessages(req, res) {
        try {
            const messages = await chatService.getMessages(req.params.id, req.user.userId);
            res.status(200).json(messages);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // POST /api/chats/:id/messages
    async sendMessage(req, res) {
        try {
            const { content } = req.body;
            const message = await chatService.sendMessage(req.params.id, req.user.userId, content);
            res.status(201).json(message);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // GET /api/chats/unread-count
    async getUnreadCount(req, res) {
        try {
            const where = req.user.role === 'student' 
                ? { studentId: req.user.userId }
                : { employerId: req.user.userId };
                
            const chats = await Chat.findAll({ where });
            
            let totalUnread = 0;
            for (const chat of chats) {
                const unreadCount = await Message.count({
                    where: {
                        chatId: chat.id,
                        receiverId: req.user.userId,
                        isRead: false
                    }
                });
                totalUnread += unreadCount;
            }
            
            res.status(200).json({ count: totalUnread });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async deleteChat(req, res) {
        try {
            const result = await chatService.deleteChat(req.params.id, req.user.userId);
            res.json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new ChatController();