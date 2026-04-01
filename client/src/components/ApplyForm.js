import React, { useState, useEffect} from "react";
import { observer } from "mobx-react-lite";
import studentProfileService from "../services/studentProfileService";

const ApplyForm = ({ vacancyId, onClose, onSubmit }) => {

  const [setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    group: "",
    skills: "",
    contacts: "",
    about: "",
    coverLetter: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await studentProfileService.getMyProfile();
        setProfile(data);
        if (data && Object.keys(data).length > 0) {
          setFormData({
            fullName: data.fullName || "",
            group: data.group || "",
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
            contacts: data.contacts?.phone || "",
            about: data.about || "",
            coverLetter: ""
          });
        }
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(s => s);
    
    const applicationData = {
      vacancyId,
      fullName: formData.fullName,
      group: formData.group,
      skills: skillsArray,
      contacts: formData.contacts,
      about: formData.about,
      coverLetter: formData.coverLetter
    };
    
    await onSubmit(applicationData);
  };

  if (loading) return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1050
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1050
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "24px",
        width: "90%",
        maxWidth: "550px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 35px rgba(0,0,0,0.25)"
      }}>
        {/* Заголовок */}
        <div style={{ 
          padding: "20px 24px", 
          borderBottom: "1px solid #e9ecef",
          backgroundColor: "#f8fafc",
          borderRadius: "24px 24px 0 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "600", color: "#0f172a" }}>
            Отклик на вакансию
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#64748b",
              padding: "0 4px"
            }}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#1e293b", fontSize: "0.9rem" }}>
              ФИО
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#1e293b", fontSize: "0.9rem" }}>
              Группа
            </label>
            <input
              type="text"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#1e293b", fontSize: "0.9rem" }}>
              Навыки
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#1e293b", fontSize: "0.9rem" }}>
              Контакты
            </label>
            <input
              type="text"
              name="contacts"
              value={formData.contacts}
              onChange={handleChange}
              placeholder="+7 999 123-45-67, @telegram"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#1e293b", fontSize: "0.9rem" }}>
              О себе
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#1e293b", fontSize: "0.9rem" }}>
              Вопросы / дополнительная информация
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={4}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
          
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "30px",
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
            >
              Отправить отклик
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "30px",
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(ApplyForm);