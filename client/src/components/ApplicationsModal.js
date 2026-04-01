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

  const handleOpenChat = (chatId, appId) => {
    setChats(prev => ({
      ...prev,
      [appId]: { ...prev[appId], unreadCount: 0 }
    }));
    setSelectedChatId(chatId);
    setShowChat(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: "#f59e0b", color: "#1e293b", fontSize: "0.85rem", fontWeight: "500" }}>На рассмотрении</span>;
      case 'accepted':
        return <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: "#10b981", color: "white", fontSize: "0.85rem", fontWeight: "500" }}>Принят</span>;
      case 'rejected':
        return <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: "#ef4444", color: "white", fontSize: "0.85rem", fontWeight: "500" }}>Отказано</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: "20px", border: "none", overflow: "hidden" }}>
          <div className="modal-header border-0 pt-4 px-4" style={{ backgroundColor: "#f1f5f9" }}>
            <h5 className="modal-title fw-bold" style={{ color: "#0f172a", fontSize: "1.25rem" }}>
              Отклики на вакансию
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body px-4 py-4" style={{ backgroundColor: "#f8fafc", maxHeight: "70vh", overflowY: "auto" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>Пока нет откликов</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {applications.map(app => {
                  const chat = chats[app.id];
                  const unreadCount = chat?.unreadCount || 0;
                  
                  return (
                    <div key={app.id} style={{ 
                      backgroundColor: "white", 
                      borderRadius: "16px", 
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      border: "1px solid #e2e8f0"
                    }}>
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "1.1rem" }}>
                              {app.fullName}
                            </h5>
                            <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
                              {app.group}
                            </p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>

                        <div className="mb-3">
                          <div className="row g-3">
                            <div className="col-6">
                              <div style={{ backgroundColor: "#f1f5f9", borderRadius: "12px", padding: "12px" }}>
                                <span className="text-secondary d-block mb-1" style={{ fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px" }}>НАВЫКИ</span>
                                <p className="mb-0" style={{ color: "#334155", fontSize: "0.95rem", fontWeight: "500" }}>
                                  {app.skills?.join(", ") || "—"}
                                </p>
                              </div>
                            </div>
                            <div className="col-6">
                              <div style={{ backgroundColor: "#f1f5f9", borderRadius: "12px", padding: "12px" }}>
                                <span className="text-secondary d-block mb-1" style={{ fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px" }}>КОНТАКТЫ</span>
                                <p className="mb-0" style={{ color: "#334155", fontSize: "0.95rem", fontWeight: "500" }}>
                                  {app.contacts || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ backgroundColor: "#f1f5f9", borderRadius: "12px", padding: "12px", marginBottom: "12px" }}>
                          <span className="text-secondary d-block mb-1" style={{ fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px" }}>О СЕБЕ</span>
                          <p className="mb-0" style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.5" }}>
                            {app.about || "—"}
                          </p>
                        </div>

                        {app.additionalInfo && (
                          <div style={{ backgroundColor: "#fef9e3", borderRadius: "12px", padding: "12px", marginBottom: "12px", borderLeft: "3px solid #f59e0b" }}>
                            <span className="text-secondary d-block mb-1" style={{ fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px", color: "#b45309" }}>ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ</span>
                            <p className="mb-0" style={{ color: "#92400e", fontSize: "0.95rem" }}>
                              {app.additionalInfo}
                            </p>
                          </div>
                        )}

                        <div className="d-flex gap-3 mt-4 pt-2">
                          {chat && (
                            <button
                              onClick={() => handleOpenChat(chat.id, app.id)}
                              className="btn position-relative"
                              style={{ 
                                backgroundColor: "#3b82f6", 
                                color: "white",
                                borderRadius: "30px",
                                padding: "8px 24px",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                border: "none"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                            >
                              💬 Чат
                              {unreadCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "11px", padding: "4px 8px" }}>
                                  {unreadCount}
                                </span>
                              )}
                            </button>
                          )}
                          
                          {app.status === 'pending' && (
                            <div className="ms-auto d-flex gap-2">
                              <button
                                onClick={() => updateStatus(app.id, 'accepted')}
                                className="btn"
                                style={{ 
                                  backgroundColor: "#10b981", 
                                  color: "white",
                                  borderRadius: "30px",
                                  padding: "8px 24px",
                                  fontSize: "0.9rem",
                                  fontWeight: "500",
                                  border: "none"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#059669"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
                              >
                                Принять
                              </button>
                              <button
                                onClick={() => updateStatus(app.id, 'rejected')}
                                className="btn"
                                style={{ 
                                  backgroundColor: "transparent", 
                                  color: "#ef4444",
                                  borderRadius: "30px",
                                  padding: "8px 24px",
                                  fontSize: "0.9rem",
                                  fontWeight: "500",
                                  border: "1px solid #ef4444"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "#ef4444";
                                  e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.color = "#ef4444";
                                }}
                              >
                                Отклонить
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0 pb-4 px-4" style={{ backgroundColor: "#f1f5f9" }}>
            <button
              type="button"
              className="btn px-4 py-2"
              onClick={onClose}
              style={{ 
                backgroundColor: "#64748b", 
                color: "white",
                borderRadius: "30px",
                border: "none",
                fontSize: "0.9rem"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#475569"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
            >
              Закрыть
            </button>
          </div>
        </div>
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