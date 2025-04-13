// src/services/api.js
import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const auth = {
  // Login user
  login: async (email, password) => {
    return await API.post('/auth/login', { email, password });
  },
  
  // Register user
  register: async (userData) => {
    return await API.post('/auth/register', userData);
  },
  
  // Get current user profile
  getProfile: async () => {
    return await API.get('/auth/me');
  },
  
  // Logout user
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return await API.get('/auth/logout');
  }
};

// Admin services
export const admin = {
  // Get all sections
  getSections: async () => {
    return await API.get('/section');
  },
  
  // Add new section
  addSection: async (sectionData) => {
    return await API.post('/section', sectionData);
  },
  
  // Get all teachers
  getTeachers: async () => {
    return await API.get('/auth/teachers');
  },
  
  // Get all salles
  getSalles: async () => {
    return await API.get('/salle');
  },
  
  // Get all filieres
  getFilieres: async () => {
    return await API.get('/filiere');
  }
};

export default API;