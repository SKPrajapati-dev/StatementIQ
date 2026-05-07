export interface AuthPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    accountNumber: string;
    phone?: string;
}