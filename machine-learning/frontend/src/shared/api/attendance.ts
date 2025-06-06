import { axiosInstance, } from './axios';

export interface CreateAttendanceRequest { childId: number; }

export const attendanceApi = {
    get: (date: string) =>
        axiosInstance.post('/attendance/select', { date }),
    create: (data: CreateAttendanceRequest) =>
        axiosInstance.post('/attendance/create', data),
};