const workFormatService = require('../services/workFormatService');

class EmploymentTypeController {
    // GET /api/work-formats
    async getAll(req, res) {
        try {
            const items = await workFormatService.getAll();
            res.status(200).json(items);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET 	/api/work-formats/:id
    async getById(req, res) {
        try {
            const item = await workFormatService.getById(req.params.id);
            res.status(200).json(item);
        } catch (e) {
            res.status(404).json({ message: e.message });
        }
    }

    // POST /api/work-formats
    async create(req, res) {
        try {
            const item = await workFormatService.create(req.body);
            res.status(201).json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PUT 	/api/work-formats/:id
    async update(req, res) {
        try {
            const item = await workFormatService.update(req.params.id, req.body);
            res.status(200).json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // DELETE /api/work-formats/:id 
    async delete(req, res) {
        try {
            const result = await workFormatService.delete(req.params.id);
            res.status(200).json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new EmploymentTypeController();