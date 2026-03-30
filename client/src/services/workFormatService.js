import { $authHost } from "../http";

class WorkFormatService {

  async getAll() {
    const { data } = await $authHost.get("/work-formats");
    return data;
  }

  async getById(id) {
    const { data } = await $authHost.get(`/work-formats/${id}`);
    return data;
  }

  async create(workFormatData) {
    const { data } = await $authHost.post("/work-formats", workFormatData);
    return data;
  }

  async update(id, workFormatData) {
    const { data } = await $authHost.put(`/work-formats/${id}`, workFormatData);
    return data;
  }

  async delete(id) {
    const { data } = await $authHost.delete(`/work-formats/${id}`);
    return data;
  }
}

const workFormatService = new WorkFormatService();
export default workFormatService;