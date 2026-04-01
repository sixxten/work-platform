import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import vacancyService from "../services/vacancyService";
import VacancyMainCard from "../components/VacancyMainCard";
import notificationService from "../services/notificationService";
import NotificationsModal from "../components/NotificationsModal";
import chatService from "../services/chatService";
import ChatModal from "../components/ChatModal";

const Main = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(Context);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showChats, setShowChats] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const allVacancies = await vacancyService.getAllActive();
        setVacancies(allVacancies);
      } catch (err) {
        console.error("Ошибка при загрузке вакансий:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (auth.isAuth) {
        try {
          const data = await notificationService.getUnreadCount();
          setUnreadCount(data.count);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUnreadCount();
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

  const handleProfileClick = () => {
    if (!auth.isAuth) navigate("/login");
    else navigate("/profile");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top" style={{ 
        backgroundColor: "rgba(102, 126, 234, 0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="#" onClick={() => navigate("/")} style={{ fontSize: "1.5rem" }}>
            Platform
          </a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <button
                  onClick={handleProfileClick}
                  className="btn btn-outline-light px-3"
                  style={{ borderRadius: "20px" }}
                >
                  {auth.isAuth ? "Профиль" : "Авторизоваться"}
                </button>
              </li>

              {auth.isAuth && auth.user?.role === "employer" && (
                <li className="nav-item">
                  <button
                    onClick={() => navigate("/vacancies")}
                    className="btn btn-success px-3"
                    style={{ borderRadius: "20px" }}
                  >
                    Мои вакансии
                  </button>
                </li>
              )}
              {auth.isAuth && (
                <li className="nav-item position-relative">
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="btn btn-outline-light position-relative px-3"
                    style={{ borderRadius: "20px" }}
                  >
                    Уведомления
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              )}

              {auth.isAuth && auth.user?.role === "student" && (
                <li className="nav-item position-relative">
                  <button
                    onClick={() => setShowChats(true)}
                    className="btn btn-outline-light position-relative px-3"
                    style={{ borderRadius: "20px" }}
                  >
                    Чаты
                    {unreadMessagesCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <h1 className="text-center mb-5" style={{ color: "#333" }}>Вакансии</h1>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Нет вакансий
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
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showChats && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Мои чаты</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowChats(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {chats.length === 0 ? (
                  <p className="text-muted text-center">
                    Чтобы взаимодействовать с работодателем, нужно подать заявку
                  </p>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`card mb-2 ${chat.unreadCount > 0 ? "border-warning" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="card-body">
                        <h6 className="card-title">{chat.vacancy?.title}</h6>
                        <p className="card-text small text-muted">{chat.vacancy?.company}</p>
                        {chat.lastMessage && (
                          <small className="text-secondary">
                            {chat.lastMessage.length > 50
                              ? chat.lastMessage.substring(0, 50) + "..."
                              : chat.lastMessage}
                          </small>
                        )}
                        {chat.unreadCount > 0 && (
                          <span className="badge bg-danger float-end">{chat.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowChats(false)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedChat && (
        <ChatModal chatId={selectedChat} onClose={() => setSelectedChat(null)} />
      )}
    </>
  );
};

export default Main;