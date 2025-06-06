
import axios, { AxiosInstance } from 'axios';

// — Axios 인스턴스 생성 & 기본 설정 —
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://c203ur.duckdns.org/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
});

// — 인터셉터: 요청에 토큰 자동 추가 & 응답 에러 처리 —
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // TODO: 리프레시 로직 또는 로그인 리다이렉트
        }
        return Promise.reject(error);
    }
);