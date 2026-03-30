import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import vacancyService from "../services/vacancyService";

function VacancyPage() {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Загрузка...</p>;
  if (error)
    return (
      <div style={{ padding: "20px" }}>
        <Link to="/vacancies">← Назад</Link>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!vacancy) return <p>Вакансия не найдена</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/vacancies" style={{ display: "block", marginBottom: 20 }}>
        ← Назад к списку
      </Link>

      <h2>{vacancy.title}</h2>
      <p><strong>Компания:</strong> {vacancy.company}</p>
      <p><strong>Локация:</strong> {vacancy.location || "Не указана"}</p>
      <p><strong>Зарплата:</strong> {vacancy.salary ? `${vacancy.salary} ₽` : "Не указана"}</p>
      <p><strong>Описание:</strong> {vacancy.description}</p>

      <p><strong>Тип занятости:</strong> {vacancy.employment_type?.name || "Не указан"}</p>
      <p><strong>Формат работы:</strong> {vacancy.work_format?.name || "Не указан"}</p>
      <p><strong>Специализация:</strong> {vacancy.specialization?.name || "Не указана"}</p>

      <hr />
      <p style={{ fontSize: 12, color: "gray" }}>ID: {vacancy.id}</p>
      <p style={{ fontSize: 12, color: "gray" }}>Статус: {vacancy.status}</p>
    </div>
  );
}

export default VacancyPage;