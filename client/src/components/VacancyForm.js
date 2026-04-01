import React, { useEffect, useState } from "react";
import vacancyService from "../services/vacancyService";
import workFormatService from "../services/workFormatService";
import specializationService from "../services/specializationService";
import employmentTypeService from "../services/employmentTypeService";

function VacancyForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const [workFormats, setWorkFormats] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

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
        console.error("Error", err);
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
      employmentTypeId: employmentTypeId ? Number(employmentTypeId) : null,
      workFormatId: workFormatId ? Number(workFormatId) : null,
      specializationId: specializationId ? Number(specializationId) : null,
    };

    try {
      setLoading(true);
      await vacancyService.create(vacancyData);

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
      setError(err.response?.data?.message || "Ошибка при создании вакансии");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
      <div className="card-body p-4">
        <h4 className="card-title mb-4" style={{ color: "#1e293b" }}>
          Создание вакансии
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Название вакансии</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Компания</label>
              <input
                type="text"
                className="form-control"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Локация</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Зарплата (₽)</label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Формат работы</label>
              <select
                className="form-select"
                value={workFormatId}
                onChange={(e) => setWorkFormatId(e.target.value)}
                required
              >
                <option value="">Выбрать</option>
                {workFormats.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Тип занятости</label>
              <select
                className="form-select"
                value={employmentTypeId}
                onChange={(e) => setEmploymentTypeId(e.target.value)}
                required
              >
                <option value="">Выбрать</option>
                {employmentTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Специализация</label>
              <select
                className="form-select"
                value={specializationId}
                onChange={(e) => setSpecializationId(e.target.value)}
                required
              >
                <option value="">Выбрать</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Описание вакансии *</label>
              <textarea
                className="form-control"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="col-12 mt-3">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={loading}
                style={{ borderRadius: "25px" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Создание...
                  </>
                ) : (
                  "Создать вакансию"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VacancyForm;