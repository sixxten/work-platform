import React from "react";
import vacancyService from "../services/vacancyService";

function VacancyCard({ vacancy, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("Удалить эту вакансию?")) return;

    try {
      await vacancyService.delete(vacancy.id);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить вакансию");
    }
  };

  // безопасные значения (если что-то undefined / null)
  const title = vacancy.title || "Без названия";
  const company = vacancy.company || "Не указана компания";
  const location = vacancy.location || "Не указана локация";
  const description = vacancy.description || "Без описания";
  const salary = vacancy.salary ? `${vacancy.salary} ₽` : "Не указана";

  // названия справочников из включённых объектов
  const employmentTypeName = vacancy.employment_type?.name || "Не указан";
  const workFormatName = vacancy.work_format?.name || "Не указан";
  const specializationName = vacancy.specialization?.name || "Не указана";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 15,
        marginBottom: 15,
        borderRadius: 6,
        backgroundColor: "#fafafa",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>

      <p><strong>Компания:</strong> {company}</p>
      <p><strong>Локация:</strong> {location}</p>
      <p><strong>Зарплата:</strong> {salary}</p>
      <p><strong>Описание:</strong> {description}</p>

      <p><strong>Тип занятости:</strong> {employmentTypeName}</p>
      <p><strong>Формат работы:</strong> {workFormatName}</p>
      <p><strong>Специализация:</strong> {specializationName}</p>

      <button
        onClick={handleDelete}
        style={{
          padding: "6px 12px",
          border: "none",
          backgroundColor: "#dc3545",
          color: "#fff",
          cursor: "pointer",
          borderRadius: "4px",
          marginTop: "10px",
        }}
      >
        Удалить
      </button>
    </div>
  );
}

export default VacancyCard;
