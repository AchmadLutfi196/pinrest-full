import api from './api';
import { Pin, PaginatedResponse, CreatePinDto, UpdatePinDto, SavePinDto } from '../types';

export const pinService = {
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Pin>> {
    const response = await api.get<PaginatedResponse<Pin>>('/pins', {
      params: { page, limit },
    });
    return response.data;
  },

  async search(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Pin>> {
    const response = await api.get<PaginatedResponse<Pin>>('/pins/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async getById(id: number): Promise<Pin> {
    const response = await api.get<Pin>(`/pins/${id}`);
    return response.data;
  },

  async create(data: CreatePinDto): Promise<Pin> {
    const response = await api.post<Pin>('/pins', data);
    return response.data;
  },

  async update(id: number, data: UpdatePinDto): Promise<Pin> {
    const response = await api.patch<Pin>(`/pins/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/pins/${id}`);
  },

  async toggleLike(id: number): Promise<{ liked: boolean; likesCount: number }> {
    const response = await api.post<{ liked: boolean; likesCount: number }>(`/pins/${id}/like`);
    return response.data;
  },

  async saveToBoard(id: number, data: SavePinDto): Promise<void> {
    await api.post(`/pins/${id}/save`, data);
  },
};

export default pinService;
