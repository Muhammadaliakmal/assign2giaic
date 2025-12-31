'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================================================
// Auth API
// ============================================================================

export interface SignupData {
    email: string;
    username: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user_id: number;
    username: string;
}

export const authAPI = {
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/signup', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },
};

// ============================================================================
// Tasks API
// ============================================================================

export interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface TaskCreate {
    title: string;
    description?: string;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    completed?: boolean;
}

export const tasksAPI = {
    getAll: async (userId: number): Promise<Task[]> => {
        const response = await api.get<Task[]>(`/api/${userId}/tasks`);
        return response.data;
    },

    getOne: async (userId: number, taskId: number): Promise<Task> => {
        const response = await api.get<Task>(`/api/${userId}/tasks/${taskId}`);
        return response.data;
    },

    create: async (userId: number, data: TaskCreate): Promise<Task> => {
        const response = await api.post<Task>(`/api/${userId}/tasks`, data);
        return response.data;
    },

    update: async (userId: number, taskId: number, data: TaskUpdate): Promise<Task> => {
        const response = await api.put<Task>(`/api/${userId}/tasks/${taskId}`, data);
        return response.data;
    },

    delete: async (userId: number, taskId: number): Promise<void> => {
        await api.delete(`/api/${userId}/tasks/${taskId}`);
    },

    toggleComplete: async (userId: number, taskId: number): Promise<Task> => {
        const response = await api.patch<Task>(`/api/${userId}/tasks/${taskId}/complete`);
        return response.data;
    },
};

export default api;
