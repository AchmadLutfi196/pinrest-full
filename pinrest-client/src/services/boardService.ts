import api from './api';
import { Board, CreateBoardDto, UpdateBoardDto } from '../types';

export const boardService = {
  async getAll(): Promise<Board[]> {
    const response = await api.get<Board[]>('/boards');
    return response.data;
  },

  async getById(id: number): Promise<Board> {
    const response = await api.get<Board>(`/boards/${id}`);
    return response.data;
  },

  async create(data: CreateBoardDto): Promise<Board> {
    const response = await api.post<Board>('/boards', data);
    return response.data;
  },

  async update(id: number, data: UpdateBoardDto): Promise<Board> {
    const response = await api.patch<Board>(`/boards/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/boards/${id}`);
  },
};

export default boardService;
