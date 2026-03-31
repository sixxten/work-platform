import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import vacancyService from "../services/vacancyService";
import VacancyMainCard from "../components/VacancyMainCard";
import notificationService from "../services/notificationService";
import NotificationsModal from "../components/NotificationsModal";

const Main = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(Context);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [auth.isAuth]);

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
    </div>
  );
};

export default Main;