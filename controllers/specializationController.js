const specializationService = require('../services/specializationService');

class EmploymentTypeController {
    // GET /api/specializations
    async getAll(req, res) {
        try {
            const items = await specializationService.getAll();
            res.json(items);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET 	/api/specializations/:id
    async getById(req, res) {
        try {
            const item = await specializationService.getById(req.params.id);
            res.json(item);
        } catch (e) {
            res.status(404).json({ message: e.message });
        }
    }

    // POST /api/specializations (admin/moderator only)
    async create(req, res) {
        try {
            const item = await specializationService.create(req.body);
            res.status(201).json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PUT 	/api/specializations/:id (admin/moderator only)
    async update(req, res) {
        try {
            const item = await specializationService.update(req.params.id, req.body);
            res.json(item);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // DELETE /api/specializations/:id (admin/moderator only)
    async delete(req, res) {
        try {
            const result = await specializationService.delete(req.params.id);
            res.json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new EmploymentTypeController();