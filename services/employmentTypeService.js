const  EmploymentType  = require('../models/EmploymentType');

class EmploymentTypeService {
    async getAll() {
        return await EmploymentType.findAll();
        
    }

    async getById(id) {
        const item = await EmploymentType.findByPk(id);
        if (!item) {
            throw new Error('Employment type not found');
        }
        return item;
    }

    async create(data) {
        const { name, slug } = data;
        
        const existing = await EmploymentType.findOne({ where: { name } });
        if (existing) {
            throw new Error('Employment type already exists');
        }
        
        return await EmploymentType.create({ name, slug });
    }

    async update(id, data) {
        const item = await this.getById(id);
        await item.update(data);
        return item;
    }

    async delete(id) {
        const item = await this.getById(id);
        await item.destroy();
        return { message: 'Employment type deleted' };
    }
}

module.exports = new EmploymentTypeService();