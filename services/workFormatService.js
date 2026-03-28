const { WorkFormat } = require('../models/WorkFormat');

class WorkFormatService {
    async getAll() {
        return await WorkFormat.findAll();
    }

    async getById(id) {
        const item = await WorkFormat.findByPk(id);
        if (!item) throw new Error('Work format not found');
        return item;
    }

    async create(data) {
        const { name, slug } = data;
        const existing = await WorkFormat.findOne({ where: { name } });
        if (existing) throw new Error('Work format already exists');
        return await WorkFormat.create({ name, slug });
    }

    async update(id, data) {
        const item = await this.getById(id);
        await item.update(data);
        return item;
    }

    async delete(id) {
        const item = await this.getById(id);
        await item.destroy();
        return { message: 'Work format deleted' };
    }
}

module.exports = new WorkFormatService();