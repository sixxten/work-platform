const  Application = require('../models/Application');
const  Vacancy = require('../models/Vacancy')
const User = require('../models/User')

class ApplicationService {
    async create(data) {
        return await Application.create(data);
    }

    async getByVacancyId(vacancyId, employerId) {
        const vacancy = await Vacancy.findByPk(vacancyId);
        if (!vacancy) throw new Error('Vacancy not found');
        if (vacancy.employerId !== employerId) {
            throw new Error('You can only view applications for your own vacancies');
        }
        
        return await Application.findAll({
            where: { vacancyId },
            order: [['createdAt', 'DESC']]
        });
    }

    async getMyApplications(studentId) {
        return await Application.findAll({
            where: { studentId },
            include: [{
                model: Vacancy,
                attributes: ['id', 'title', 'company', 'status']
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    async updateStatus(id, status, employerId) {
        const application = await Application.findByPk(id);
        if (!application) throw new Error('Application not found');
        
        const vacancy = await Vacancy.findByPk(application.vacancyId);
        if (vacancy.employerId !== employerId) {
            throw new Error('You can only update applications for your own vacancies');
        }
        
        await application.update({ status });
        return application;
    }
}

module.exports = new ApplicationService();