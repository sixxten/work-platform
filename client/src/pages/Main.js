import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import vacancyService from "../services/vacancyService";
import VacancyMainCard from "../components/VacancyMainCard";
import notificationService from "../services/notificationService";
import NotificationsModal from "../components/NotificationsModal";
import chatService from "../services/chatService";
import ChatModal from "../components/ChatModal";
import Navbar from "../components/Navbar";

const Main = () => {
  const [allVacancies, setAllVacancies] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const navigate = useNavigate();
  const { auth } = useContext(Context);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showChats, setShowChats] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const updateUnreadCount = async () => {
    if (auth.isAuth) {
      try {
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.count);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacanciesData, typesData] = await Promise.all([
          vacancyService.getAllActive(),
          vacancyService.getEmploymentTypes()
        ]);
        setAllVacancies(vacanciesData);
        setVacancies(vacanciesData);
        setEmploymentTypes(typesData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allVacancies];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v => 
        v.title?.toLowerCase().includes(term) ||
        v.company?.toLowerCase().includes(term)
      );
    }
    
    if (selectedEmploymentType) {
      filtered = filtered.filter(v => 
        v.employment_type?.name === selectedEmploymentType
      );
    }
    
    setVacancies(filtered);
  }, [searchTerm, selectedEmploymentType, allVacancies]);

  useEffect(() => {
    updateUnreadCount();
  }, [auth.isAuth]);

  useEffect(() => {
    const fetchChats = async () => {
      if (auth.isAuth && auth.user?.role === 'student') {
        try {
          const data = await chatService.getMyChats();
          setChats(data);
          const unreadCountData = await chatService.getUnreadCount();
          setUnreadMessagesCount(unreadCountData.count);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchChats();
  }, [auth.isAuth, auth.user?.role]);

  return (
    <>
      <Navbar 
        unreadCount={unreadCount}
        unreadMessagesCount={unreadMessagesCount}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showChats={showChats}
        setShowChats={setShowChats}
      />

      <div className="container py-5">
        <h1 className="text-center mb-4" style={{ color: "#333" }}>Вакансии</h1>
        
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="d-flex gap-3 flex-wrap justify-content-center">
              <div className="flex-grow-1" style={{ minWidth: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Поиск"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: "30px", padding: "10px 20px" }}
                />
              </div>
              
              <select
                className="form-select"
                value={selectedEmploymentType}
                onChange={(e) => setSelectedEmploymentType(e.target.value)}
                style={{ width: "auto", minWidth: "180px", borderRadius: "30px", padding: "10px 20px" }}
              >
                <option value="">Все типы</option>
                {employmentTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
              
              {(searchTerm || selectedEmploymentType) && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedEmploymentType("");
                  }}
                  style={{ borderRadius: "30px", padding: "10px 20px" }}
                >
                  Сбросить ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-5 text-muted">
            {searchTerm || selectedEmploymentType ? "Ничего не найдено" : "Нет вакансий"}
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="col-md-4 col-lg-3">
                <VacancyMainCard
                  vacancy={vacancy}
                  onClick={(id) => navigate(`/vacancies/${id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)} 
          onUnreadCountChange={updateUnreadCount}
        />
      )}

      {showChats && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "20px", border: "none", overflow: "hidden" }}>
              <div className="modal-header border-0 pt-4 px-4" style={{ backgroundColor: "#f8fafc" }}>
                <h5 className="modal-title fw-bold" style={{ color: "#0f172a", fontSize: "1.25rem" }}>
                  💬 Мои чаты
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowChats(false)}
                  aria-label="Close"
                ></button>
              </div>
              
              <div className="modal-body px-4 py-4" style={{ backgroundColor: "#f8fafc", maxHeight: "70vh", overflowY: "auto" }}>
                {chats.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0" style={{ fontSize: "1rem" }}>
                      Чтобы взаимодействовать с работодателем, нужно подать заявку
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        style={{ 
                          backgroundColor: "white", 
                          borderRadius: "16px", 
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                          border: chat.unreadCount > 0 ? "1px solid #f59e0b" : "1px solid #e2e8f0",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => setSelectedChat(chat.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                        }}
                      >
                        <div className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "1rem" }}>
                              {chat.vacancy?.title}
                            </h6>
                            {chat.unreadCount > 0 && (
                              <span className="badge rounded-pill" style={{ backgroundColor: "#ef4444", color: "white", fontSize: "0.7rem", padding: "4px 10px" }}>
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-muted small mb-2" style={{ fontSize: "0.85rem", color: "#64748b" }}>
                            {chat.vacancy?.company}
                          </p>
                          {chat.lastMessage && (
                            <p className="mb-0 text-secondary" style={{ fontSize: "0.85rem", color: "#475569", marginTop: "8px" }}>
                              <span className="fw-medium">Последнее сообщение:</span>{" "}
                              {chat.lastMessage.length > 80 ? chat.lastMessage.substring(0, 80) + "..." : chat.lastMessage}
                            </p>
                          )}
                          <div className="mt-3 d-flex justify-content-end">
                            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                              {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleDateString('ru-RU') : 'Нет сообщений'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="modal-footer border-0 pb-4 px-4" style={{ backgroundColor: "#f8fafc" }}>
                <button
                  type="button"
                  className="btn px-4 py-2"
                  onClick={() => setShowChats(false)}
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
        </div>
      )}

      {selectedChat && (
        <ChatModal 
          chatId={selectedChat} 
          onClose={() => setSelectedChat(null)} 
        />
      )}
    </>
  );
};

export default Main;