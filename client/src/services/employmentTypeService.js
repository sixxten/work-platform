import { $authHost } from "../http";

class EmploymentTypeService {

  async getAll() {
    const { data } = await $authHost.get("/employment-types");
    return data;
  }

  async getById(id) {
    const { data } = await $authHost.get(`/employment-types/${id}`);
    return data;
  }

  async create(employmentTypeData) {
    const { data } = await $authHost.post("/employment-types", employmentTypeData);
    return data;
  }

  async update(id, employmentTypeData) {
    const { data } = await $authHost.put(`/employment-types/${id}`, employmentTypeData);
    return data;
  }

  async delete(id) {
    const { data } = await $authHost.delete(`/employment-types/${id}`);
    return data;
  }
}

const employmentTypeService = new EmploymentTypeService();
export default employmentTypeService;