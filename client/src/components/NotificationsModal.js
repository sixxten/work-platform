import React, { useState, useEffect, useRef } from "react";
import notificationService from "../services/notificationService";

function NotificationsModal({ onClose, onUnreadCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

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
        setTimeout(() => setIsVisible(true), 10);
      }
    };
    fetchNotifications();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      const newUnreadCount = unreadCount - 1;
      setUnreadCount(newUnreadCount);
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
      if (!notifications.find(n => n.id === id)?.isRead) {
        const newUnreadCount = unreadCount - 1;
        setUnreadCount(newUnreadCount);
        if (onUnreadCountChange) onUnreadCountChange();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1049,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease-out"
        }}
        onClick={handleClose}
      />
      
      <div 
        ref={modalRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, ${isVisible ? '-50%' : '-60%'})`,
          width: "450px",
          maxHeight: "600px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 35px rgba(0,0,0,0.25)",
          zIndex: 1050,
          overflow: "hidden",
          opacity: isVisible ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.25s ease-out"
        }}
      >
        <div style={{ 
          padding: "18px 24px", 
          borderBottom: "1px solid #e9ecef",
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "#0f172a" }}>
            Уведомления
            {unreadCount > 0 && (
              <span style={{ 
                marginLeft: "10px",
                backgroundColor: "#ef4444", 
                color: "white",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem"
              }}>
                {unreadCount}
              </span>
            )}
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#64748b",
              padding: "0 4px"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ 
          overflowY: "auto", 
          maxHeight: "500px"
        }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#94a3b8" }}>
              У вас нет уведомлений
            </div>
          ) : (
            <>
              {unreadCount > 0 && (
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #e9ecef", textAlign: "right" }}>
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3b82f6",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      padding: "4px 8px"
                    }}
                  >
                    Отметить все как прочитанные
                  </button>
                </div>
              )}
              
              {notifications.map(notif => (
                <div 
                  key={notif.id} 
                  style={{ 
                    padding: "16px 20px",
                    borderBottom: "1px solid #e9ecef",
                    backgroundColor: notif.isRead ? "white" : "#fef9e3",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                      {notif.title}
                    </strong>
                  </div>
                  <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "#475569", lineHeight: "1.45" }}>
                    {notif.message}
                  </p>
                  <div style={{ marginTop: "8px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationsModal;