export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string; // только для фронтенд валидации
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  expiresIn?: number;
}