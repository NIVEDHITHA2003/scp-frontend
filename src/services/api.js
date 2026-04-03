import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'
});

// Add request interceptor to attach token to every request
API.interceptors.request.use(
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

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

export const resourceAPI = {
  create: (data) => API.post('/resources', data),
  getAll: (params) => API.get('/resources', { params }),
  update: (id, data) => API.put(`/resources/${id}`, data),
  delete: (id) => API.delete(`/resources/${id}`),
  getAnalytics: () => API.get('/resources/analytics')
};

export const userAPI = {
  getAll: () => API.get('/users'),
  delete: (id) => API.delete(`/users/${id}`)
};

export default API;
