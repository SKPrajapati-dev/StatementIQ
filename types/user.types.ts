export interface AuthPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  accountNumber: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
