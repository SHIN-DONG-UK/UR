// shared/api/rest.ts

import { axiosInstance } from './axios';

export const get = async <T>(url: string, params?: unknown): Promise<T> => {
    const res = await axiosInstance.get(url, { params });
    return res.data.result;
};

export const post = async <T, U = unknown>(url: string, body?: U): Promise<T> => {
    const res = await axiosInstance.post(url, body);
    return res.data.result;
};

export const put = async <T, U = unknown>(url: string, body?: U): Promise<T> => {
    const res = await axiosInstance.put(url, body);
    return res.data.result;
};

export const del = async <T>(url: string, params?: unknown): Promise<T> => {
    const res = await axiosInstance.delete(url, { params });
    return res.data.result;
};
