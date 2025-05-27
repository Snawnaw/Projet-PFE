import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const auth = {
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      return response; // Return the full response object
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  logout: async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const response = await API.get('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export const admin = {
  // Sections
  getSections: async () => {
    try {
      const response = await API.get('/section/AllSections');
      return response.data?.sections || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addSection: async (sectionData) => {
    try {
      const response = await API.post('/section/SectionCreate', sectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSection: async (id, sectionData) => {
    try {
      const response = await API.put(`/section/SectionEdit/${id}`, sectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteSection: async (id) => {
    try {
      const response = await API.delete(`/section/SectionDelete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Salles
  getSalles: async () => {
    try {
      const response = await API.get('/salle/AllSalle');
      return response.data?.salles || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addSalle: async (salleData) => {
    try {
      const response = await API.post('/salle/SalleCreate', salleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSalle: async (id, salleData) => {
    try {
      const response = await API.put(`/salle/SalleEdit/${id}`, salleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteSalle: async (id) => {
    try {
      const response = await API.delete(`/salle/SalleDelete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Filieres
  getFilieres: async () => {
    try {
      const response = await API.get('/filiere/AllFiliere');
      return response.data?.filieres || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addFiliere: async (filiereData) => {
    try {
      const response = await API.post('/filiere/FiliereCreate', filiereData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateFiliere: async (id, filiereData) => {
    try {
      const response = await API.put(`/filiere/FiliereEdit/${id}`, filiereData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteFiliere: async (id) => {
    try {
      const response = await API.delete(`/filiere/FiliereDelete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default API;