// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend URL'inizi buraya yazın
});

// İstek engelleyici ekleyin
api.interceptors.request.use(
    config => {
        // Giriş ve kayıt isteklerinde token eklemeyin
        if (!config.url.includes('/login') && !config.url.includes('/register')) {
            const token = localStorage.getItem('token'); // JWT'yi yerel depolamadan alın
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
