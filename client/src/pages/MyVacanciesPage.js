import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import VacancyCard from "../components/VacancyCard";
import VacancyForm from "../components/VacancyForm";
import vacancyService from "../services/vacancyService";

function MyVacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { auth } = useContext(Context);

  const loadVacancies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await vacancyService.getMyVacancies();
      setVacancies(data);
    } catch (e) {
      console.error(e);
      setError("Ошибка при загрузке вакансий");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacancies();
  }, []);

  const handleVacancyCreated = () => {
    setShowForm(false);
    loadVacancies();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top" style={{ 
        backgroundColor: "rgba(102, 126, 234, 0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div className="container">
          <a className="navbar-brand fw-bold text-white"  onClick={() => navigate("/")} style={{ fontSize: "1.5rem" }}>
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
            <ul className="navbar-nav ms-auto align-items-center gap-3">
              <li className="nav-item">
                <button
                  onClick={handleProfileClick}
                  className="btn btn-outline-light px-4"
                  style={{ borderRadius: "20px" }}
                >
                  Профиль
                </button>
              </li>
              {auth.user?.role === "employer" && (
                <li className="nav-item">
                  <button
                    onClick={() => navigate("/vacancies")}
                    className="btn btn-success px-4"
                    style={{ borderRadius: "20px" }}
                  >
                    Мои вакансии
                  </button>
                </li>
              )}
              <li className="nav-item">
                <button
                  onClick={async () => {
                    await auth.logout();
                    navigate("/");
                  }}
                  className="btn btn-danger px-4"
                  style={{ borderRadius: "20px" }}
                >
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: "800px" }}>
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="card-title mb-0">Мои вакансии</h1>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? "Скрыть форму" : "+ Создать вакансию"}
              </button>
            </div>

            {showForm && (
              <div className="mb-4 p-3 bg-light rounded">
                <VacancyForm onSuccess={handleVacancyCreated} />
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            )}

            <h2 className="h5 text-muted mb-3">Список вакансий</h2>

            {vacancies.length === 0 && !loading ? (
              <p className="text-muted text-center py-3">Пока нет вакансий</p>
            ) : (
              vacancies.map((v) => (
                <VacancyCard
                  key={v.id}
                  vacancy={v}
                  onDeleted={loadVacancies}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyVacanciesPage;