import React, { useState } from "react";
import vacancyService from "../services/vacancyService";
import ApplicationsModal from "./ApplicationsModal.js";

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
      className="mb-3" 
      style={{ 
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        overflow: "hidden"
      }}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="h4 fw-semibold mb-0" style={{ color: "#0f172a" }}>
            {title}
          </h3>
          <span 
            className="px-3 py-1 rounded-pill" 
            style={{ 
              fontSize: "0.75rem",
              fontWeight: "500",
              backgroundColor: "#e2e8f0",
              color: "#334155"
            }}
          >
            {employmentTypeName}
          </span>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <p className="mb-2" style={{ color: "#475569" }}>
              <span className="fw-semibold" style={{ color: "#1e293b" }}>Компания:</span> {company}
            </p>
            <p className="mb-2" style={{ color: "#475569" }}>
              <span className="fw-semibold" style={{ color: "#1e293b" }}>Локация:</span> {location}
            </p>
            <p className="mb-2" style={{ color: "#475569" }}>
              <span className="fw-semibold" style={{ color: "#1e293b" }}>Зарплата:</span> {salary}
            </p>
          </div>
          <div className="col-md-6">
            <p className="mb-2" style={{ color: "#475569" }}>
              <span className="fw-semibold" style={{ color: "#1e293b" }}>Формат работы:</span> {workFormatName}
            </p>
            <p className="mb-2" style={{ color: "#475569" }}>
              <span className="fw-semibold" style={{ color: "#1e293b" }}>Специализация:</span> {specializationName}
            </p>
          </div>
        </div>

        <p className="mb-4" style={{ color: "#475569" }}>
          <span className="fw-semibold" style={{ color: "#1e293b" }}>Описание:</span><br />
          {description}
        </p>

        <div className="d-flex gap-2">
          <button
            onClick={() => setShowApplications(true)}
            className="btn btn-outline-primary px-4"
            style={{ borderRadius: "20px", fontSize: "0.9rem" }}
          >
            Отклики
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-outline-danger px-4"
            style={{ borderRadius: "20px", fontSize: "0.9rem" }}
          >
            Удалить
          </button>
        </div>
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