import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import vacancyService from "../services/vacancyService";
import applicationService from "../services/applicationService";
import ApplyForm from "../components/ApplyForm";

function VacancyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(Context);
  const [vacancy, setVacancy] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    async function fetchVacancy() {
      try {
        const data = await vacancyService.getById(id);
        setVacancy(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Вакансия недоступна");
      } finally {
        setLoading(false);
      }
    }
    fetchVacancy();
  }, [id]);

  const handleApplySubmit = async (applicationData) => {
    try {
      await applicationService.create(applicationData);
      setShowApplyForm(false); // закрываем форму после отправки
    } catch (err) {
      console.error("Ошибка отправки отклика:", err);
      alert(err.response?.data?.message || "Не удалось отправить отклик");
    }
  };

  const handleProfileClick = () => {
    if (!auth.isAuth) navigate("/login");
    else navigate("/profile");
  };

  const Navbar = () => (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ 
      backgroundColor: "rgba(102, 126, 234, 0.9)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <div className="container">
        <span 
          className="navbar-brand fw-bold text-white" 
          onClick={() => navigate("/")} 
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
        >
          Platform
        </span>
        
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
                {auth.isAuth ? "Профиль" : "Авторизоваться"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="alert alert-danger">{error}</div>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            На главную
          </button>
        </div>
      </>
    );
  }

  if (!vacancy) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <p className="text-muted">Вакансия не найдена</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            На главную
          </button>
        </div>
      </>
    );
  }

  const isActive = vacancy.status === "active";
  const isStudent = auth.user?.role === "student";

  return (
    <>
      <Navbar />

      <div className="container py-4" style={{ maxWidth: "800px" }}>
        <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
          <div className="card-body p-4 p-lg-5">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h1 className="h2 fw-bold mb-0" style={{ color: "#0f172a" }}>
                {vacancy.title}
              </h1>
              <div className="d-flex align-items-center gap-2">
                {isActive ? (
                  <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-success bg-opacity-10 text-success">
                    <span className="d-inline-block rounded-circle bg-success" style={{ width: "8px", height: "8px" }}></span>
                    Активна
                  </span>
                ) : (
                  <span className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-secondary bg-opacity-10 text-secondary">
                    <span className="d-inline-block rounded-circle bg-secondary" style={{ width: "8px", height: "8px" }}></span>
                    Закрыта
                  </span>
                )}
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                  <p className="mb-2 text-secondary"><span className="fw-semibold text-dark">Компания:</span> {vacancy.company}</p>
                  <p className="mb-2 text-secondary"><span className="fw-semibold text-dark">Локация:</span> {vacancy.location || "Не указана"}</p>
                  <p className="mb-0 text-secondary"><span className="fw-semibold text-dark">Зарплата:</span> {vacancy.salary ? `${vacancy.salary.toLocaleString("ru-RU")} ₽` : "Не указана"}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                  <p className="mb-2 text-secondary"><span className="fw-semibold text-dark">Тип занятости:</span> {vacancy.employment_type?.name || "Не указан"}</p>
                  <p className="mb-2 text-secondary"><span className="fw-semibold text-dark">Формат работы:</span> {vacancy.work_format?.name || "Не указан"}</p>
                  <p className="mb-0 text-secondary"><span className="fw-semibold text-dark">Специализация:</span> {vacancy.specialization?.name || "Не указана"}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h5 fw-semibold mb-3" style={{ color: "#1e293b" }}>Описание вакансии</h3>
              <p className="text-secondary" style={{ lineHeight: "1.6" }}>{vacancy.description}</p>
            </div>

            {isStudent && (
              <div className="mt-4">
                {isActive ? (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="btn btn-primary btn-lg px-5"
                    style={{ borderRadius: "30px" }}
                  >
                    Откликнуться
                  </button>
                ) : (
                  <div className="alert alert-secondary mb-0">Эта вакансия закрыта, откликнуться нельзя</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplyForm && (
        <ApplyForm
          vacancyId={vacancy.id}
          onClose={() => setShowApplyForm(false)}
          onSubmit={handleApplySubmit}
        />
      )}
    </>
  );
}

export default observer(VacancyPage);