import React from "react";

const VacancyMainCard = ({ vacancy, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(vacancy.id)}
      className="card h-100"
      style={{ 
        cursor: "pointer", 
        transition: "all 0.2s ease",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#f0f9ff"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#94a3b8";
        e.currentTarget.style.backgroundColor = "#ffffff";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.backgroundColor = "#f0f9ff";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="card-body p-4">
        <h5 className="card-title fw-semibold mb-2" style={{ fontSize: "1.1rem", color: "#1e293b" }}>
          {vacancy.title}
        </h5>
        <p className="text-secondary small mb-2" style={{ color: "#475569" }}>
          {vacancy.company}
        </p>
        {vacancy.salary && (
          <p className="fw-medium mb-2" style={{ color: "#3b82f6" }}>
            {vacancy.salary.toLocaleString("ru-RU")} ₽
          </p>
        )}
        {vacancy.employment_type?.name && (
          <span style={{ 
            display: "inline-block",
            border: "1px solid #1e293b",
            color: "#1e293b",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "500",
            backgroundColor: "transparent"
          }}>
            {vacancy.employment_type.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default VacancyMainCard;