import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import vacancyService from "../services/vacancyService";
import applicationService from "../services/applicationService";
import ApplyForm from "../components/ApplyForm";

function VacancyPage() {
  const { id } = useParams();
  const { auth } = useContext(Context);
  const [vacancy, setVacancy] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

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
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyForm(false);
        setApplySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Ошибка отправки отклика:", err);
      alert(err.response?.data?.message || "Не удалось отправить отклик");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return (
    <div>
      <Link to="/vacancies">← Назад</Link>
      <div style={{ color: "red" }}>{error}</div>
    </div>
  );
  if (!vacancy) return <div>Вакансия не найдена</div>;

  const isActive = vacancy.status === "active";
  const isStudent = auth.user?.role === "student";

  return (
    <div>


      <h2>{vacancy.title}</h2>
      <p><strong>Компания:</strong> {vacancy.company}</p>
      <p><strong>Локация:</strong> {vacancy.location || "Не указана"}</p>
      <p><strong>Зарплата:</strong> {vacancy.salary ? `${vacancy.salary} ₽` : "Не указана"}</p>
      <p><strong>Описание:</strong> {vacancy.description}</p>

      <p><strong>Тип занятости:</strong> {vacancy.employment_type?.name || "Не указан"}</p>
      <p><strong>Формат работы:</strong> {vacancy.work_format?.name || "Не указан"}</p>
      <p><strong>Специализация:</strong> {vacancy.specialization?.name || "Не указана"}</p>

      <hr />

      {isStudent && isActive && (
        <button onClick={() => setShowApplyForm(true)}>
          Откликнуться
        </button>
      )}

      {!isActive && (
        <p>Error</p>
      )}

      {applySuccess && (
        <p>Success</p>
      )}

      <p>ID: {vacancy.id}</p>
      <p>Статус: {vacancy.status}</p>

      {showApplyForm && (
        <ApplyForm
          vacancyId={vacancy.id}
          onClose={() => setShowApplyForm(false)}
          onSubmit={handleApplySubmit}
        />
      )}
    </div>
  );
}

export default observer(VacancyPage);