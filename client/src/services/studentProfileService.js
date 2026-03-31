import { $authHost } from '../http';

class StudentProfileService {
    async getMyProfile() {
        const { data } = await $authHost.get('/student-profile');
        return data;
    }

    async createProfile(profileData) {
        const { data } = await $authHost.post('/student-profile', profileData);
        return data;
    }

    async updateProfile(profileData) {
        const { data } = await $authHost.put('/student-profile', profileData);
        return data;
    }


     async upsertProfile(profileData) {
        const { data } = await $authHost.patch('/student-profile', profileData);
        return data;
    }
}

const studentProfileService = new StudentProfileService();

export default studentProfileService;