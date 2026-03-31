import React, { useState, useEffect } from "react";
import notificationService from "../services/notificationService";


// Закрытие окна
function NotificationsModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

// Загрузка уведомлений
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notificationsData, countData] = await Promise.all([
          notificationService.getMyNotifications(),
          notificationService.getUnreadCount()
        ]);
        setNotifications(notificationsData);
        setUnreadCount(countData.count);
      } catch (err) {
        console.error("Ошибка загрузки уведомлений:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Прочитано
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  // Отметить всё
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (!notifications.find(n => n.id === id)?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };
 // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        maxWidth: "500px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto"
      }}>
        <h2>Уведомления</h2>
        
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead}>
            Отметить все как прочитанные
          </button>
        )}
        
        {loading && <p>Загрузка...</p>}
        
        {notifications.length === 0 && !loading && (
          <p>У вас нет уведомлений</p>
        )}
        
        {notifications.map(notif => (
          <div key={notif.id}>
            <div>
              <strong>{notif.title}</strong>
              <small>{formatDate(notif.createdAt)}</small>
            </div>
            <p>{notif.message}</p>
            <div>
              {!notif.isRead && (
                <button onClick={() => handleMarkAsRead(notif.id)}>
                  Прочитано
                </button>
              )}
              <button onClick={() => handleDelete(notif.id)}>
                Удалить
              </button>
            </div>
            <hr />
          </div>
        ))}
        
        <button onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default NotificationsModal;