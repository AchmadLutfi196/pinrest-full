// User types
export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Board types
export interface Board {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  isPrivate: boolean;
  userId: number;
  user?: User;
  pins?: Pin[];
  _count?: {
    pins: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Pin types
export interface Pin {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  userId: number;
  user?: User;
  boardId?: number;
  board?: Board;
  likes?: Like[];
  _count?: {
    likes: number;
    savedPins: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Like types
export interface Like {
  id: number;
  userId: number;
  pinId: number;
  createdAt: string;
}

// Saved Pin types
export interface SavedPin {
  id: number;
  userId: number;
  pinId: number;
  boardId: number;
  createdAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  bio?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Create/Update DTOs
export interface CreatePinDto {
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  boardId?: number;
}

export interface UpdatePinDto {
  title?: string;
  description?: string;
  link?: string;
}

export interface CreateBoardDto {
  title: string;
  description?: string;
  coverImage?: string;
  isPrivate?: boolean;
}

export interface UpdateBoardDto {
  title?: string;
  description?: string;
  coverImage?: string;
  isPrivate?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface SavePinDto {
  boardId: number;
}
