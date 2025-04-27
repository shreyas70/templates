import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

// Patient services
export const patientService = {
  getAll: async (params?: any) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (patientData: any) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },
  update: async (id: string, patientData: any) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

// Doctor services
export const doctorService = {
  getAll: async (params?: any) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  create: async (doctorData: any) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },
  update: async (id: string, doctorData: any) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },
};

// Appointment services
export const appointmentService = {
  getAll: async (params?: any) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  update: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

// Billing services
export const billingService = {
  getAll: async (params?: any) => {
    const response = await api.get('/billing', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/billing/${id}`);
    return response.data;
  },
  create: async (billingData: any) => {
    const response = await api.post('/billing', billingData);
    return response.data;
  },
  update: async (id: string, billingData: any) => {
    const response = await api.put(`/billing/${id}`, billingData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/billing/${id}`);
    return response.data;
  },
};

export default api;
