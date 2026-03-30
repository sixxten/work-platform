import { makeAutoObservable } from 'mobx';
import authService from '../services/authService';

export default class AuthStore {
    user = null;
    isAuth = false;
    isLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    async login(email, password) {
        this.setLoading(true);
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            const userData = await authService.getProfile();

            this.setAuth(true);
            this.setUser(userData);

            return { success: true };
        } catch (e) {
            return { 
                success: false, 
                error: e.response?.data?.message || 'Ошибка входа' 
            };
        } finally {
            this.setLoading(false);
        }
    }

    async register(email, password, role) {
        this.setLoading(true);
        try {
            const data = await authService.register(email, password, role);
            return { success: true, userId: data.userId };
        } catch (e) {
            return { 
                success: false, 
                error: e.response?.data?.message || 'Ошибка регистрации' 
            };
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            await authService.logout();
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            this.setAuth(false);
            this.setUser(null);
            localStorage.removeItem('accessToken');
        }
    }

    async checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
        const data = await authService.getProfile();
        this.setUser(data);
        this.setAuth(true);
        } catch (e) {
        localStorage.removeItem('accessToken');
        }
    }
    this.setLoading(false);
    }
}
