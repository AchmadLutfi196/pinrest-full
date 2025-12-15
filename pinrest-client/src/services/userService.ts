import api from './api';
import { User, Board, Pin, UpdateUserDto } from '../types';

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateMe(data: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async getUserBoards(id: number): Promise<Board[]> {
    const response = await api.get<Board[]>(`/users/${id}/boards`);
    return response.data;
  },

  async getUserPins(id: number): Promise<Pin[]> {
    const response = await api.get<Pin[]>(`/users/${id}/pins`);
    return response.data;
  },
};

export default userService;
