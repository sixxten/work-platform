const StudentProfile  = require('../models/StudentProfile');

class StudentProfileService {
    async getByUserId(userId) {
        const profile = await StudentProfile.findOne({ where: { userId } });
        return profile;
    }

    async create(userId, userData) {
        const exist = await StudentProfile.findOne({ where: { userId } });
        
        if (exist) {
            throw new Error('Student profile already exists');
        }
        
        return await StudentProfile.create({ userId, ...userData });
    }

    async update(userId, userData) {
        const profile = await StudentProfile.findOne({ where: { userId } });
        
        if (!profile) {
            throw new Error('Student profile does not exist');
        }
        
        await profile.update(userData);
        return profile;
    }


    async upsert(userId, userData) {
        let profile = await StudentProfile.findOne({ where: { userId } });
        
        if (profile) {
            await profile.update(userData);
            return profile;
        } else {
            return await StudentProfile.create({ userId, ...userData });
        }
    }
}

module.exports = new StudentProfileService();