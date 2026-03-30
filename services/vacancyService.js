// vacancyService.js
const Vacancy = require("../models/Vacancy");
const EmploymentType = require("../models/EmploymentType");
const WorkFormat = require("../models/WorkFormat");
const Specialization = require("../models/Specialization");

// ВАЖНО: установить связи (ассоциации) один раз
// чтобы Sequelize знал, как join'ить таблицы

Vacancy.belongsTo(EmploymentType, {
  foreignKey: "employmentTypeId",
  as: "employment_type",
});
Vacancy.belongsTo(WorkFormat, {
  foreignKey: "workFormatId",
  as: "work_format",
});
Vacancy.belongsTo(Specialization, {
  foreignKey: "specializationId",
  as: "specialization",
});

class VacancyService {
  // Получить список вакансий
  async getAll(filters = {}, userRole, userId) {
    const where = {};

    // если студент — только активные
    if (userRole === "student") {
      where.status = "active";
    }

    // если работодатель — только свои
    if (userRole === "employer") {
      where.employerId = userId;
    }

    // дополнительные фильтры
    if (filters.employmentTypeId) {
      where.employmentTypeId = filters.employmentTypeId;
    }
    if (filters.workFormatId) {
      where.workFormatId = filters.workFormatId;
    }
    if (filters.specializationId) {
      where.specializationId = filters.specializationId;
    }

    // возвращаем вакансии с JOIN'ами
    return await Vacancy.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        { model: EmploymentType, as: "employment_type", attributes: ["id", "name"] },
        { model: WorkFormat, as: "work_format", attributes: ["id", "name"] },
        { model: Specialization, as: "specialization", attributes: ["id", "name"] },
      ],
    });
  }

  // Получить вакансию по ID
  async getById(id, userRole, userId) {
    const vacancy = await Vacancy.findByPk(id, {
      include: [
        { model: EmploymentType, as: "employment_type", attributes: ["id", "name"] },
        { model: WorkFormat, as: "work_format", attributes: ["id", "name"] },
        { model: Specialization, as: "specialization", attributes: ["id", "name"] },
      ],
    });

    if (!vacancy) {
      throw new Error("Vacancy not found");
    }

    if (userRole === "student" && vacancy.status !== "active") {
      throw new Error("Vacancy not available");
    }

    if (
      userRole === "employer" &&
      vacancy.employerId !== userId &&
      vacancy.status !== "active"
    ) {
      throw new Error("Vacancy not available");
    }

    return vacancy;
  }

  // Создать вакансию (только employer или admin)
  async create(data, employerId) {
    const vacancyData = {
      ...data,
      employerId,
    };
    return await Vacancy.create(vacancyData);
  }

  // Обновить вакансию (только владелец или admin)
  async update(id, data, userId, userRole) {
    const vacancy = await Vacancy.findByPk(id);
    if (!vacancy) {
      throw new Error("Vacancy not found");
    }

    if (vacancy.employerId !== userId && userRole !== "admin") {
      throw new Error("You can only edit your own vacancies");
    }

    await vacancy.update(data);
    return vacancy;
  }

  // Удалить вакансию (только владелец или admin)
  async delete(id, userId, userRole) {
    const vacancy = await Vacancy.findByPk(id);
    if (!vacancy) {
      throw new Error("Vacancy not found");
    }

    if (vacancy.employerId !== userId && userRole !== "admin") {
      throw new Error("You can only delete your own vacancies");
    }

    await vacancy.destroy();
    return { message: "Vacancy deleted successfully" };
  }

  // Получить вакансии работодателя (для профиля)
  async getByEmployer(employerId, userRole, requesterId) {
    if (userRole === "employer" && employerId !== requesterId) {
      throw new Error("You can only view your own vacancies");
    }

    return await Vacancy.findAll({
      where: { employerId },
      order: [["createdAt", "DESC"]],
      include: [
        { model: EmploymentType, as: "employment_type", attributes: ["id", "name"] },
        { model: WorkFormat, as: "work_format", attributes: ["id", "name"] },
        { model: Specialization, as: "specialization", attributes: ["id", "name"] },
      ],
    });
  }
}

module.exports = new VacancyService();