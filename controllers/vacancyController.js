const vacancyService = require('../services/vacancyService');

class VacancyController {
    // GET /api/vacancies
    async getAll(req, res) {
        try {
            const filters = req.query;
            const userRole = req.user?.role;
            const userId = req.user?.userId;
            
            const vacancies = await vacancyService.getAll(filters, userRole, userId);
            res.status(200).json(vacancies);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // GET /api/vacancies/:id
    async getById(req, res) {
        try {
            const vacancy = await vacancyService.getById(
                req.params.id,
                req.user?.role,
                req.user?.userId
            );
            res.status(200).json(vacancy);
        } catch (e) {
            res.status(404).json({ message: e.message });
        }
    }

    // POST /api/vacancies
    async create(req, res) {
        try {
            const vacancy = await vacancyService.create(req.body, req.user.userId);
            res.status(201).json(vacancy);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PUT /api/vacancies/:id
    async update(req, res) {
        try {
            const vacancy = await vacancyService.update(
                req.params.id,
                req.body,
                req.user.userId,
                req.user.role
            );
            res.status(200).json(vacancy);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // DELETE /api/vacancies/:id
    async delete(req, res) {
        try {
            const result = await vacancyService.delete(
                req.params.id,
                req.user.userId,
                req.user.role
            );
            res.status(200).json(result);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // GET /api/vacancies/employer/:employerId
    async getByEmployer(req, res) {
        try {
            const { employerId } = req.params;
            const vacancies = await vacancyService.getByEmployer(
                employerId,
                req.user?.role,
                req.user?.userId
            );
            res.status(200).json(vacancies);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // PATCH /api/vacancies/:id/status
    async changeStatus(req, res) {
        try {
            const { status } = req.body;
            const vacancy = await vacancyService.changeStatus(
                req.params.id,
                status,
                req.user.userId,
                req.user.role
            );
            res.status(200).json(vacancy);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new VacancyController();