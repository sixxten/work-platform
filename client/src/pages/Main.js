import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import vacancyService from "../services/vacancyService";
import VacancyMainCard from "../components/VacancyMainCard"; // новый компонент

const Main = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(Context);

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
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Активные вакансии
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>Загрузка...</div>
      ) : vacancies.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          Активных вакансий нет
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
    </div>
  );
};

export default Main;
