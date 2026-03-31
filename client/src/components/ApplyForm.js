import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import studentProfileService from "../services/studentProfileService";

const ApplyForm = ({ vacancyId, onClose, onSubmit }) => {
  const { auth } = useContext(Context);
  const [profile, setProfile] = useState(null);
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

  if (loading) return <div>Загрузка данных...</div>;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        maxWidth: "500px",
        width: "90%"
      }}>
        <h2>Отклик на вакансию</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>ФИО:</label><br />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label>Группа:</label><br />
            <input
              type="text"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label>Навыки (через запятую):</label><br />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, Git"
            />
          </div>
          
          <div>
            <label>Контакты:</label><br />
            <input
              type="text"
              name="contacts"
              value={formData.contacts}
              onChange={handleChange}
              placeholder="+7 999 123-45-67, @telegram"
            />
          </div>
          
          <div>
            <label>О себе:</label><br />
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div>
            <label>Вопросы/доп информация:</label><br />
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div>
            <button type="submit">Отправить отклик</button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(ApplyForm);