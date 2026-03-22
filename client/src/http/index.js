import axios from "axios";

const baseURL = 'http://localhost:5000/api';

const $host = axios.create({
    withCredentials: true,
    baseURL: baseURL
});

const $authHost = axios.create({
    baseURL: baseURL
});

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
};