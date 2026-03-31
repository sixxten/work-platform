const studentProfileService = require('../services/studentProfileService');

class StudentProfileController {
    // GET /api/student-profile
    async getMyProfile(req, res) {
        try {
            const profile = await studentProfileService.getByUserId(req.user.userId);
            res.status(200).json(profile || {});
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // POST /api/student-profile
    async create(req, res) {
        try {
            const profile = await studentProfileService.create(req.user.userId, req.body);
            res.status(201).json(profile);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    // PUT /api/student-profile
    async update(req, res) {
        try {
            const profile = await studentProfileService.update(req.user.userId, req.body);
            res.status(200).json(profile);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }


     async upsert(req, res) {
        try {
            const profile = await studentProfileService.upsert(req.user.userId, req.body);
            res.status(200).json(profile);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

}

module.exports = new StudentProfileController();