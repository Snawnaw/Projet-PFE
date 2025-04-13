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
  // Sections
  getAllSections: async () => {
    return await API.get('/section');
  },
  getSection: async (id) => {
    return await API.get(`/section/${id}`);
  },
  addSection: async (sectionData) => {
    return await API.post('/section', sectionData);
  },
  updateSection: async (id, sectionData) => {
    return await API.put(`/section/${id}`, sectionData);
  },
  deleteSection: async (id) => {
    return await API.delete(`/section/${id}`);
  },

  // Teachers
  /*getAllTeachers: async () => {
    return await API.get('/auth/teachers');
  },
  getTeacher: async (id) => {
    return await API.get(`/auth/teachers/${id}`);
  },*/

  // Salles
  getAllSalles: async () => {
    return await API.get('/salle');
  },
  getSalle: async (id) => {
    return await API.get(`/salle/${id}`);
  },
  addSalle: async (salleData) => {
    return await API.post('/salle', salleData);
  },
  updateSalle: async (id, salleData) => {
    return await API.put(`/salle/${id}`, salleData);
  },
  deleteSalle: async (id) => {
    return await API.delete(`/salle/${id}`);
  },

  // Filieres
  getAllFilieres: async () => {
    return await API.get('/filiere');
  },
  getFiliere: async (id) => {
    return await API.get(`/filiere/${id}`);
  },
  addFiliere: async (filiereData) => {
    return await API.post('/filiere', filiereData);
  },
  updateFiliere: async (id, filiereData) => {
    return await API.put(`/filiere/${id}`, filiereData);
  },
  deleteFiliere: async (id) => {
    return await API.delete(`/filiere/${id}`);
  }
};

export default API;