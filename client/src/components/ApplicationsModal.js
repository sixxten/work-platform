import React, { useState, useEffect } from "react";
import applicationService from "../services/applicationService";
import chatService from "../services/chatService";
import ChatModal from "./ChatModal";

function ApplicationsModal({ vacancyId, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getByVacancyId(vacancyId);
        setApplications(data);
        
        const userChats = await chatService.getMyChats();
        const chatsData = {};
        for (const app of data) {
          const chat = userChats.find(c => 
            c.studentId === app.studentId && c.vacancyId === vacancyId
          );
          if (chat) {
            chatsData[app.id] = chat;
          }
        }
        setChats(chatsData);
      } catch (err) {
        console.error("Ошибка загрузки откликов:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [vacancyId]);

  const updateStatus = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, status);
      setApplications(applications.map(app =>
        app.id === appId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error("Ошибка обновления статуса:", err);
      alert("Не удалось обновить статус");
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'На рассмотрении';
      case 'reviewed': return 'Просмотрено';
      case 'accepted': return 'Принят';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
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
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        borderRadius: "8px"
      }}>
        <h2>Отклики на вакансию</h2>
        
        {loading && <p>Загрузка...</p>}
        
        {applications.length === 0 && !loading && (
          <p>Пока нет откликов</p>
        )}
        
        {applications.map(app => {
          const chat = chats[app.id];
          const unreadCount = chat?.unreadCount || 0;
          
          return (
            <div key={app.id} style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}>
              <p><strong>Студент:</strong> {app.fullName}</p>
              <p><strong>Группа:</strong> {app.group}</p>
              <p><strong>Навыки:</strong> {app.skills?.join(", ") || "—"}</p>
              <p><strong>Контакты:</strong> {app.contacts || "—"}</p>
              <p><strong>О себе:</strong> {app.about || "—"}</p>
              <p><strong>Доп. информация:</strong> {app.additionalInfo || "—"}</p>
              <p><strong>Статус:</strong> {getStatusText(app.status)}</p>
              
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {chat && (
                  <button
                    onClick={() => {
                      setSelectedChatId(chat.id);
                      setShowChat(true);
                    }}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#17a2b8",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                      position: "relative"
                    }}
                  >
                    💬 Чат
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px 6px",
                          fontSize: "12px",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}
                
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, 'accepted')}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px"
                      }}
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'rejected')}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px"
                      }}
                    >
                      Отклонить
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        
        <button
          onClick={onClose}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Закрыть
        </button>
      </div>
      
      {showChat && (
        <ChatModal
          chatId={selectedChatId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default ApplicationsModal;