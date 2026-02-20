import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Crucial for cookies
});

export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const logout = () => api.post('/logout');
export const getMe = () => api.get('/me');
export const getBalance = () => api.get('/balance');
export const transferMoney = (data) => api.post('/transfer', data);
export const withdrawMoney = (data) => api.post('/withdraw', data);

export default api;
