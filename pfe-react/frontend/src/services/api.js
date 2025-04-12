import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to handle auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const auth = {
    login: async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password
            });
            console.log('Login response:', response); // Debug log
            return response;
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.');
            }
            throw error.response?.data || error;
        }
    },
    getUser: async () => {
        try {
            const response = await api.get('/api/auth/user');
            return response;
        } catch (error) {
            console.error('Get user error:', error);
            throw error.response?.data || error;
        }
    }
};
