import { $authHost } from '../http';

class ApplicationService {
  async create(data) {
    const { data: response } = await $authHost.post('/applications', data);
    return response;
  }

  async getByVacancyId(vacancyId) {
    const { data } = await $authHost.get(`/applications/vacancy/${vacancyId}`);
    return data;
  }

  async getMyApplications() {
    const { data } = await $authHost.get('/applications/my');
    return data;
  }

  async updateStatus(id, status) {
    const { data } = await $authHost.patch(`/applications/${id}/status`, { status });
    return data;
  }
}

const applicationService = new ApplicationService();

export default applicationService;