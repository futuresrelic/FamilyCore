/**
 * API Service - Handles all backend communication
 */
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear and redirect to login
      await SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, fullName?: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Kids API
export const kidsAPI = {
  getAll: async () => {
    const response = await api.get('/kids/');
    return response.data;
  },

  getOne: async (kidId: number) => {
    const response = await api.get(`/kids/${kidId}`);
    return response.data;
  },

  create: async (kidData: any) => {
    const response = await api.post('/kids/', kidData);
    return response.data;
  },

  update: async (kidId: number, kidData: any) => {
    const response = await api.put(`/kids/${kidId}`, kidData);
    return response.data;
  },

  delete: async (kidId: number) => {
    const response = await api.delete(`/kids/${kidId}`);
    return response.data;
  },
};

// Chores API
export const choresAPI = {
  getAll: async (kidId?: number, status?: string) => {
    const params = new URLSearchParams();
    if (kidId) params.append('kid_id', kidId.toString());
    if (status) params.append('status', status);
    const response = await api.get(`/chores/?${params.toString()}`);
    return response.data;
  },

  getOne: async (choreId: number) => {
    const response = await api.get(`/chores/${choreId}`);
    return response.data;
  },

  create: async (choreData: any) => {
    const response = await api.post('/chores/', choreData);
    return response.data;
  },

  update: async (choreId: number, choreData: any) => {
    const response = await api.put(`/chores/${choreId}`, choreData);
    return response.data;
  },

  complete: async (choreId: number) => {
    const response = await api.post(`/chores/${choreId}/complete`);
    return response.data;
  },

  approve: async (choreId: number) => {
    const response = await api.post(`/chores/${choreId}/approve`);
    return response.data;
  },

  delete: async (choreId: number) => {
    const response = await api.delete(`/chores/${choreId}`);
    return response.data;
  },
};

// Rewards API
export const rewardsAPI = {
  getAll: async () => {
    const response = await api.get('/rewards/');
    return response.data;
  },

  create: async (rewardData: any) => {
    const response = await api.post('/rewards/', rewardData);
    return response.data;
  },

  update: async (rewardId: number, rewardData: any) => {
    const response = await api.put(`/rewards/${rewardId}`, rewardData);
    return response.data;
  },

  redeem: async (rewardId: number, kidId: number) => {
    const response = await api.post(`/rewards/${rewardId}/redeem?kid_id=${kidId}`);
    return response.data;
  },

  delete: async (rewardId: number) => {
    const response = await api.delete(`/rewards/${rewardId}`);
    return response.data;
  },
};

// Calendar API
export const calendarAPI = {
  getAll: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await api.get(`/calendar/?${params.toString()}`);
    return response.data;
  },

  create: async (eventData: any) => {
    const response = await api.post('/calendar/', eventData);
    return response.data;
  },

  update: async (eventId: number, eventData: any) => {
    const response = await api.put(`/calendar/${eventId}`, eventData);
    return response.data;
  },

  delete: async (eventId: number) => {
    const response = await api.delete(`/calendar/${eventId}`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getKidHistory: async (kidId: number, days: number = 30) => {
    const response = await api.get(`/analytics/kid/${kidId}/history?days=${days}`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  getChoreSuggestions: async () => {
    const response = await api.get('/ai/chore-suggestions');
    return response.data;
  },

  createFromNaturalLanguage: async (prompt: string) => {
    const response = await api.post(`/ai/natural-chore?prompt=${encodeURIComponent(prompt)}`);
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get('/ai/insights');
    return response.data;
  },

  generateInsights: async () => {
    const response = await api.post('/ai/generate-insights');
    return response.data;
  },

  getRewardSuggestions: async () => {
    const response = await api.get('/ai/reward-suggestions');
    return response.data;
  },

  getMotivation: async (kidId: number) => {
    const response = await api.get(`/ai/motivation/${kidId}`);
    return response.data;
  },
};

export default api;
