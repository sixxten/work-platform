import { $host, $authHost } from '../http';

class VacancyService {
  async getAll() {
    const { data } = await $authHost.get('/vacancies');
    return data;
  }

  async getAllActive() {
    const { data } = await $host.get('/vacancies');
    return data.filter(v => v.status === 'active');
  }

  async getMyVacancies() {
    const { data } = await $authHost.get('/vacancies/my');
    return data;
}

  async getById(id) {
    const { data } = await $authHost.get(`/vacancies/${id}`);
    return data;
  }

  async create(vacancyData) {
    const { data } = await $authHost.post('/vacancies', vacancyData);
    return data;
  }

  async update(id, vacancyData) {
    const { data } = await $authHost.put(`/vacancies/${id}`, vacancyData);
    return data;
  }

  async delete(id) {
    const { data } = await $authHost.delete(`/vacancies/${id}`);
    return data;
  }

  async getEmploymentTypes() {
    const { data } = await $host.get('/employment-types');
    return data;
  }

  async getWorkFormats() {
    const { data } = await $host.get('/work-formats');
    return data;
  }

  async getSpecializations() {
    const { data } = await $host.get('/specializations');
    return data;
  }
}

const vacancyService = new VacancyService();
export default vacancyService;