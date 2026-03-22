// client/src/store/authStore.js
// Это ящик с данными. Каждый раз происходит вот это:
//  user: null → {id:1, email:...},  1. Появился пользователь
//     isAuth: false → true,              2. Статус авторизации
//     isLoading: false → true → false   3. Состояние загрузки
// 1. Страница загружается
//    ↓
// 2. Создается НОВЫЙ экземпляр AuthStore (new AuthStore())
//    ↓
// 3. Вызывается constructor()
//    ↓
// 4. Запускается this.checkAuth()
//    ↓
// 5. checkAuth() смотрит в localStorage: есть токен?
//    ↓
// 6. Если токен есть → isAuth = true, загружаем пользователя
//    ↓
// 7. Если токена нет → isAuth = false
import { makeAutoObservable } from 'mobx';
import authService from '../services/authService';

export default class AuthStore {
    user = null;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
        this.checkAuth();
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
            console.log('📦 Данные от сервера:', data);  // посмотрим что приходит
            this.setAuth(true);
            this.setUser(data.user);
            localStorage.setItem('accessToken', data.accessToken);
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

    async register(email, password) {
        this.setLoading(true);
        try {
            const data = await authService.register(email, password);
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
                this.setAuth(true);
                this.setUser(data);
            } catch (e) {
                localStorage.removeItem('accessToken');
            }
        }
    }
}