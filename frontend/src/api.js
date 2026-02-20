import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true, // Crucial for cookies
});

export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const logout = () => api.post('/logout');
export const getMe = () => api.get('/me');
export const getBalance = () => api.get('/balance');
export const transferMoney = (data) => api.post('/transfer', data);
export const postChat = (message) => api.post('/ai-chat', { message });

export default api;
