// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const projects = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) => api.post('/projects', data),
  update: (id: string, data: { name?: string; description?: string }) => 
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const tasks = {
  getAll: (projectId: string) => api.get(`/tasks?projectId=${projectId}`),
  create: (projectId: string, data: { title: string; description?: string; status?: string }) =>
    api.post('/tasks', { projectId, ...data }),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  updateStatus: (id: string, status: string, orderIndex?: number) =>
    api.patch(`/tasks/${id}/status`, { status, orderIndex }),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  reorder: (tasks: any[]) => api.post('/tasks/reorder', { tasks }),
};

export default api;