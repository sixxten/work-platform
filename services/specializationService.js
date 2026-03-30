const  Specialization  = require('../models/Specialization');

class SpecializationService {
    async getAll() {
        return await Specialization.findAll();
    }

    async getById(id) {
        const item = await Specialization.findByPk(id);
        if (!item) throw new Error('Specialization not found');
        return item;
    }

    async create(data) {
        const { name, slug } = data;
        const existing = await Specialization.findOne({ where: { name } });
        if (existing) throw new Error('Specialization already exists');
        return await Specialization.create({ name, slug });
    }

    async update(id, data) {
        const item = await this.getById(id);
        await item.update(data);
        return item;
    }

    async delete(id) {
        const item = await this.getById(id);
        await item.destroy();
        return { message: 'Specialization deleted' };
    }
}

module.exports = new SpecializationService();