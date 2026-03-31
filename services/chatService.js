const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Vacancy = require('../models/Vacancy');
const User = require('../models/User');


class ChatService {
    async createChat(application) {
        const vacancy = await Vacancy.findByPk(application.vacancyId);
        
        const [chat, created] = await Chat.findOrCreate({
            where: {
                vacancyId: application.vacancyId,
                studentId: application.studentId,
                employerId: vacancy.employerId
            },
            defaults: {
                vacancyId: application.vacancyId,
                studentId: application.studentId,
                employerId: vacancy.employerId
            }
        });
        return chat;
    }

    async getUserChats(userId, role) {
        const where = role === 'student' 
            ? { studentId: userId }
            : { employerId: userId };
            
        const chats = await Chat.findAll({
            where,
            include: [
                {
                    model: Vacancy,
                    as: 'vacancy',
                    attributes: ['id', 'title', 'company']
                },
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'email']
                },
                {
                    model: User,
                    as: 'employer',
                    attributes: ['id', 'email']
                }
            ],
            order: [['lastMessageAt', 'DESC']]
        });
        
        const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
            const unreadCount = await Message.count({
                where: {
                    chatId: chat.id,
                    receiverId: userId,
                    isRead: false
                }
            });
            
            return {
                ...chat.toJSON(),
                unreadCount
            };
        }));
        
        return chatsWithUnread;
    }

    async getMessages(chatId, userId) {
        const chat = await Chat.findByPk(chatId);
        if (!chat) throw new Error('Chat not found');
        
        if (chat.studentId !== userId && chat.employerId !== userId) {
            throw new Error('Access denied');
        }
        
        await Message.update(
            { isRead: true, readAt: new Date() },
            { where: { chatId, receiverId: userId, isRead: false } }
        );
        
        return await Message.findAll({
            where: { chatId },
            order: [['createdAt', 'ASC']]
        });
    }

    async sendMessage(chatId, senderId, content) {
        const chat = await Chat.findByPk(chatId);
        if (!chat) throw new Error('Chat not found');
        
        const receiverId = senderId === chat.studentId ? chat.employerId : chat.studentId;
        
        const message = await Message.create({
            chatId,
            senderId,
            receiverId,
            content
        });
        
        await chat.update({
            lastMessage: content,
            lastMessageAt: new Date()
        });
        

        return message;
    }

    async deleteChat(chatId, userId) {
        const chat = await Chat.findByPk(chatId);
        if (!chat) throw new Error('Chat not found');
        
        if (chat.studentId !== userId && chat.employerId !== userId) {
            throw new Error('You can only delete your own chats');
        }
        
        await Message.destroy({ where: { chatId } });
        await chat.destroy();
        
        return { message: 'Chat deleted successfully' };
    }
}

module.exports = new ChatService();