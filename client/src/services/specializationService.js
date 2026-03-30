import { $authHost } from "../http";

class SpecializationService {

  async getAll() {
    const { data } = await $authHost.get("/specializations");
    return data;
  }

  async getById(id) {
    const { data } = await $authHost.get(`/specializations/${id}`);
    return data;
  }

  async create(specializationData) {
    const { data } = await $authHost.post("/specializations", specializationData);
    return data;
  }

  async update(id, specializationData) {
    const { data } = await $authHost.put(`/specializations/${id}`, specializationData);
    return data;
  }

  async delete(id) {
    const { data } = await $authHost.delete(`/specializations/${id}`);
    return data;
  }
}

const specializationService = new SpecializationService();
export default specializationService;