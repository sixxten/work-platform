// client/src/services/authService.js
import { $host, $authHost } from '../http';

class AuthService {
    async register(email, password) {
        const { data } = await $host.post('/auth/register', { email, password });
        return data;
    }

    async login(email, password) {
        const { data } = await $host.post('/auth/login', { email, password });
        return data;
    }

    async logout() {
        const { data } = await $host.post('/auth/logout');
        return data;
    }

    async getProfile() {
        const { data } = await $authHost.get('/user/profile');
        return data;
    }
}

const authService = new AuthService();
export default authService;