import React, { useEffect, useState } from "react";
import vacancyService from "../services/vacancyService";
import workFormatService from "../services/workFormatService";
import specializationService from "../services/specializationService";
import employmentTypeService from "../services/employmentTypeService";

function VacancyForm({ onSuccess }) {
  // поля ввода
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  // справочники
  const [workFormats, setWorkFormats] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  // выбранные значения
  const [workFormatId, setWorkFormatId] = useState("");
  const [specializationId, setSpecializationId] = useState("");
  const [employmentTypeId, setEmploymentTypeId] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDictionaries() {
      try {
        const [wf, sp, et] = await Promise.all([
          workFormatService.getAll(),
          specializationService.getAll(),
          employmentTypeService.getAll(),
        ]);
        setWorkFormats(wf);
        setSpecializations(sp);
        setEmploymentTypes(et);
      } catch (err) {
        console.error("Ошибка при загрузке справочников:", err);
      }
    }
    loadDictionaries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const vacancyData = {
        title,
        description,
        salary: salary ? parseInt(salary) : null,
        company,
        location,
        employmentTypeId: employmentTypeId === "" ? 0 : Number(employmentTypeId),
        workFormatId: workFormatId === "" ? 0 : Number(workFormatId),
        specializationId: specializationId === "" ? 0 : Number(specializationId),
    };


    try {
      setLoading(true);
      await vacancyService.create(vacancyData);

      // очистка формы
      setTitle("");
      setDescription("");
      setSalary("");
      setCompany("");
      setLocation("");
      setWorkFormatId("");
      setSpecializationId("");
      setEmploymentTypeId("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Ошибка при создании вакансии");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 15, marginBottom: 20 }}>
      <h3>Создать вакансию</h3>

      <input
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%", height: 80 }}
      />

      <input
        type="number"
        placeholder="Зарплата"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <input
        placeholder="Компания"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <input
        placeholder="Локация"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      {/* выпадающие списки */}
      <label>Формат работы:</label>
      <select
        value={workFormatId}
        onChange={(e) => setWorkFormatId(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      >
        <option value="">Не указан</option>
        {workFormats.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <label>Тип занятости:</label>
      <select
        value={employmentTypeId}
        onChange={(e) => setEmploymentTypeId(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      >
        <option value="">Не указан</option>
        {employmentTypes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <label>Специализация:</label>
      <select
        value={specializationId}
        onChange={(e) => setSpecializationId(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      >
        <option value="">Не указана</option>
        {specializations.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Создание..." : "Создать"}
      </button>
    </form>
  );
}

export default VacancyForm;