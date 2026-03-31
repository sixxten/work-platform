import { $authHost } from '../http';

class ChatService {
  async getMyChats() {
    const { data } = await $authHost.get('/chats');
    return data;
  }

  async getUnreadCount() {
    const { data } = await $authHost.get('/chats/unread-count');
    return data;
  }

  async getMessages(chatId) {
    const { data } = await $authHost.get(`/chats/${chatId}/messages`);
    return data;
  }

  async sendMessage(chatId, content) {
    const { data } = await $authHost.post(`/chats/${chatId}/messages`, { content });
    return data;
  }

  getCurrentUserId() {
    return parseInt(localStorage.getItem('userId'));
  }
}

export default new ChatService();