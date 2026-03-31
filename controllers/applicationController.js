const applicationService = require('../services/applicationService');

class ApplicationController {
    async create(req, res) {
        try {
            const application = await applicationService.create({
                ...req.body,
                studentId: req.user.userId
            });
            res.status(201).json(application);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async getByVacancyId(req, res) {
        try {
            const applications = await applicationService.getByVacancyId(
                req.params.vacancyId,
                req.user.userId
            );
            res.status(200).json(applications);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async getMyApplications(req, res) {
        try {
            const applications = await applicationService.getMyApplications(req.user.userId);
            res.status(200).json(applications);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const application = await applicationService.updateStatus(
                req.params.id,
                status,
                req.user.userId
            );
            res.status(200).json(application);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new ApplicationController();