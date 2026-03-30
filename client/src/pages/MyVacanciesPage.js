import React, { useEffect, useState } from "react";
import VacancyCard from "../components/VacancyCard";
import VacancyForm from "../components/VacancyForm";
import vacancyService from "../services/vacancyService";

function MyVacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // загрузка вакансий работодателя
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

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Мои вакансии</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Скрыть форму" : "Создать вакансию"}
      </button>

      {showForm && <VacancyForm onSuccess={handleVacancyCreated} />}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Загрузка...</p>}

      <h2>Список вакансий</h2>

      {vacancies.length === 0 && !loading ? (
        <p>Пока нет вакансий</p>
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
  );
}

export default MyVacanciesPage;