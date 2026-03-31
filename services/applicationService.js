const Application = require('../models/Application');
const Vacancy = require('../models/Vacancy')
const User = require('../models/User')
const notificationService = require('./notificationService');

class ApplicationService {
    async create(data) {
        const application = await Application.create(data);
        
        // Получаем вакансию и студента
        const vacancy = await Vacancy.findByPk(application.vacancyId);
        const student = await User.findByPk(application.studentId);
        
        // Уведомление для работодателя
        await notificationService.create(
            vacancy.employerId,
            'application_created',
            'Новый отклик',
            `${student.email} откликнулся на вашу вакансию "${vacancy.title}"`,
            {
                applicationId: application.id,
                vacancyId: vacancy.id,
                studentId: student.id
            }
        );
        
        // Уведомление для студента
        await notificationService.create(
            application.studentId,
            'application_created',
            'Вы откликнулись на вакансию',
            `Вы откликнулись на вакансию "${vacancy.title}"`,
            {
                applicationId: application.id,
                vacancyId: vacancy.id
            }
        );
        
        return application;
    }

    async updateStatus(id, status, employerId) {
        const application = await Application.findByPk(id);
        if (!application) throw new Error('Application not found');
        
        const vacancy = await Vacancy.findByPk(application.vacancyId);
        if (vacancy.employerId !== employerId) {
            throw new Error('You can only update applications for your own vacancies');
        }
        
        await application.update({ status });
        
        // Уведомление для студента о смене статуса
        let statusText = '';
        switch(status) {
            case 'accepted': statusText = 'принята'; break;
            case 'rejected': statusText = 'отклонена'; break;
            default: statusText = status;
        }
        
        await notificationService.create(
            application.studentId,
            'application_status_changed',
            'Статус отклика изменен',
            `Статус вашего отклика на вакансию "${vacancy.title}" изменен на "${statusText}"`,
            {
                applicationId: application.id,
                vacancyId: vacancy.id,
                status
            }
        );
        
        return application;
    }
}

module.exports = new ApplicationService();