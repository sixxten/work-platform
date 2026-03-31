import React from "react";

const VacancyMainCard = ({ vacancy, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(vacancy.id)}
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        cursor: "pointer"
      }}
    >
      <h3>{vacancy.title}</h3>
      
      {vacancy.salary && (
        <p>Зарплата: {vacancy.salary} ₽</p>
      )}
      
      <p>Тип занятости: {vacancy.employment_type?.name || "Не указан"}</p>
    </div>
  );
};

export default VacancyMainCard;