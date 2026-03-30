const employmentTypeService = require('../services/employmentTypeService');

class EmploymentTypeController {
    // GET /api/employment-types
    async getAll(req, res) {
        try {
            const items = await employmentTypeService.getAll();
            res.json(items);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET /api/employment-types/:id
    async getById(req, res) {
        try {
            const item = await employmentTypeService.getById(req.params.id);
            res.json(item);
        } catch (e) {
            res.status(404).json({ message: e.message });
        }
    }

    // POST /api/employment-types (admin)
    async create(req, res) {
        try {
            const item = await employmentTypeService.create(req.body);
            res.status(201).json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PUT /api/employment-types/:id
    async update(req, res) {
        try {
            const item = await employmentTypeService.update(req.params.id, req.body);
            res.json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // DELETE /api/employment-types/:id
    async delete(req, res) {
        try {
            const result = await employmentTypeService.delete(req.params.id);
            res.json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new EmploymentTypeController();