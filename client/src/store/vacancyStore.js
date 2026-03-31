import { makeAutoObservable } from 'mobx';
import vacancyService from '../services/vacancyService';

class VacancyStore {
    vacancies = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchMyVacancies() {
        this.isLoading = true;
        this.error = null;
        try {
            const data = await vacancyService.getMyVacancies();
            this.vacancies = data;
        } catch (e) {
            this.error = e.response?.data?.message || 'Ошибка загрузки вакансий';
            console.error('Fetch vacancies error:', e);
        } finally {
            this.isLoading = false;
        }
    }

    async createVacancy(vacancyData) {
        this.isLoading = true;
        this.error = null;
        try {
            const newVacancy = await vacancyService.create(vacancyData);
            this.vacancies.push(newVacancy);
            return { success: true, vacancy: newVacancy };
        } catch (e) {
            this.error = e.response?.data?.message || 'Ошибка создания вакансии';
            return { success: false, error: this.error };
        } finally {
            this.isLoading = false;
        }
    }

    async deleteVacancy(id) {
        this.isLoading = true;
        try {
            await vacancyService.delete(id);
            this.vacancies = this.vacancies.filter(v => v.id !== id);
            return { success: true };
        } catch (e) {
            this.error = e.response?.data?.message || 'Ошибка удаления';
            return { success: false, error: this.error };
        } finally {
            this.isLoading = false;
        }
    }
}

const vacancyStore = new VacancyStore();

export default vacancyStore();