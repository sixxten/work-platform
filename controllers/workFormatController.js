const workFormatService = require('../services/workFormatService');

class EmploymentTypeController {
    // GET /api/work-formats
    async getAll(req, res) {
        try {
            const items = await workFormatService.getAll();
            res.json(items);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET 	/api/work-formats/:id
    async getById(req, res) {
        try {
            const item = await workFormatService.getById(req.params.id);
            res.json(item);
        } catch (e) {
            res.status(404).json({ message: e.message });
        }
    }

    // POST /api/work-formats (admin/moderator only)
    async create(req, res) {
        try {
            const item = await workFormatService.create(req.body);
            res.status(201).json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PUT 	/api/work-formats/:id (admin/moderator only)
    async update(req, res) {
        try {
            const item = await workFormatService.update(req.params.id, req.body);
            res.json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // DELETE /api/work-formats/:id (admin/moderator only)
    async delete(req, res) {
        try {
            const result = await workFormatService.delete(req.params.id);
            res.json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new EmploymentTypeController();