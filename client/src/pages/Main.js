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
    <div style={{ padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleProfileClick}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {auth.isAuth ? "Профиль" : "Авторизоваться"}
        </button>

        {auth.isAuth && auth.user?.role === "employer" && (
          <button
            onClick={() => navigate("/vacancies")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Мои вакансии
          </button>
        )}

        {auth.isAuth && (
          <button
            onClick={() => setShowNotifications(true)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            Уведомления
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

        {auth.isAuth && auth.user?.role === "student" && (
          <button
            onClick={() => setShowChats(true)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#17a2b8",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            Чаты
            {unreadMessagesCount > 0 && (
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
                {unreadMessagesCount}
              </span>
            )}
          </button>
        )}
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Вакансии</h1>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>Загрузка...</div>
      ) : vacancies.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          Нет вакансий
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px",
            justifyItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {vacancies.map((vacancy) => (
            <VacancyMainCard
              key={vacancy.id}
              vacancy={vacancy}
              onClick={(id) => navigate(`/vacancies/${id}`)}
            />
          ))}
        </div>
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showChats && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              maxWidth: "400px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "8px",
            }}
          >
            <h2>Мои чаты</h2>

            {chats.length === 0 ? (
              <p>Чтобы взаимодействовать с работодателем, нужно подать заявку</p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: chat.unreadCount > 0 ? "#fff3cd" : "white",
                  }}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <strong>{chat.vacancy?.title}</strong>
                  <p style={{ margin: "5px 0" }}>{chat.vacancy?.company}</p>
                  {chat.lastMessage && (
                    <small style={{ color: "#666" }}>
                      {chat.lastMessage.length > 50 ? chat.lastMessage.substring(0, 50) + "..." : chat.lastMessage}
                    </small>
                  )}
                  {chat.unreadCount > 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "12px",
                      }}
                    >
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}

            <button
              onClick={() => setShowChats(false)}
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {selectedChat && (
        <ChatModal chatId={selectedChat} onClose={() => setSelectedChat(null)} />
      )}
    </div>
  );
};

export default Main;