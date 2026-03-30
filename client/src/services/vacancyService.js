import { $host, $authHost } from '../http';

class VacancyService {
  // Получить все вакансии (для авторизованных)
  async getAll() {
    const { data } = await $authHost.get('/vacancies');
    return data;
  }

  // Получить все активные вакансии (публично)
  async getAllActive() {
    const { data } = await $host.get('/vacancies');
    return data.filter(v => v.status === 'active');
  }

  // Получить вакансии текущего работодателя
  async getMyVacancies() {
    const { data } = await $authHost.get('/vacancies?employerId=me');
    return data;
  }

  // Получить вакансию по ID
  async getById(id) {
    const { data } = await $authHost.get(`/vacancies/${id}`);
    return data;
  }

  // Создать вакансию
  async create(vacancyData) {
    const { data } = await $authHost.post('/vacancies', vacancyData);
    return data;
  }

  // Обновить вакансию
  async update(id, vacancyData) {
    const { data } = await $authHost.put(`/vacancies/${id}`, vacancyData);
    return data;
  }

  // Удалить вакансию
  async delete(id) {
    const { data } = await $authHost.delete(`/vacancies/${id}`);
    return data;
  }
}

const vacancyService = new VacancyService();
export default vacancyService;
