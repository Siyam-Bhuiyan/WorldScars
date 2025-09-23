import axios from 'axios';
import type { Image, ImageFormData } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const imageApi = {
  // Get all images
  getAll: async (): Promise<Image[]> => {
    const response = await api.get<Image[]>('/images');
    return response.data;
  },

  // Get image by ID
  getById: async (id: number): Promise<Image> => {
    const response = await api.get<Image>(`/images/${id}`);
    return response.data;
  },

  // Create new image
  create: async (imageData: ImageFormData): Promise<Image> => {
    const response = await api.post<Image>('/images', imageData);
    return response.data;
  },
};

export default api;