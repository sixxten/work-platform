import { $authHost } from '../http';

class NotificationService {
  async getMyNotifications() {
    const { data } = await $authHost.get('/notifications');
    return data;
  }

  async getUnreadCount() {
    const { data } = await $authHost.get('/notifications/unread-count');
    return data;
  }

  async markAsRead(id) {
    const { data } = await $authHost.patch(`/notifications/${id}/read`);
    return data;
  }

  async markAllAsRead() {
    const { data } = await $authHost.patch('/notifications/read-all');
    return data;
  }

  async delete(id) {
    const { data } = await $authHost.delete(`/notifications/${id}`);
    return data;
  }
}

const notificationService = new NotificationService();

export default notificationService;