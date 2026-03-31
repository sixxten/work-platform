import React, { useState } from "react";
import vacancyService from "../services/vacancyService";
import ApplicationsModal from "./ApplicationsModal";

function VacancyCard({ vacancy, onDeleted }) {
  const [showApplications, setShowApplications] = useState(false);

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

  const title = vacancy.title || "Без названия";
  const company = vacancy.company || "Не указана компания";
  const location = vacancy.location || "Не указана локация";
  const description = vacancy.description || "Без описания";
  const salary = vacancy.salary ? `${vacancy.salary} ₽` : "Не указана";

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

      <p><strong>Работодатель:</strong> {company}</p>
      <p><strong>Локация:</strong> {location}</p>
      <p><strong>Зарплата:</strong> {salary}</p>
      <p><strong>Описание:</strong> {description}</p>

      <p><strong>Тип занятости:</strong> {employmentTypeName}</p>
      <p><strong>Формат работы:</strong> {workFormatName}</p>
      <p><strong>Специализация:</strong> {specializationName}</p>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setShowApplications(true)}
          style={{
            padding: "6px 12px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "4px",
            marginRight: "10px"
          }}
        >
          Отклики
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: "6px 12px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Удалить
        </button>
      </div>

      {showApplications && (
        <ApplicationsModal
          vacancyId={vacancy.id}
          onClose={() => setShowApplications(false)}
        />
      )}
    </div>
  );
}

export default VacancyCard;