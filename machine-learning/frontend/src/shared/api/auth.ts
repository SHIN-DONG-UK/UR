import { axiosInstance } from './axios';

// — Payload / Response 타입 —
export interface LoginRequest { loginId: string; password: string; }
export interface LoginResponse {
    userId: number;
    role: "TEACHER" | "PARENT";
    accessToken: string;
    passwordChanged: number;
}

// — 인증 API —
export const authApi = {
    login: (data: LoginRequest) =>
        axiosInstance.post('/auth/login', data),
    logout: () =>
        axiosInstance.post('/auth/logout'),
};