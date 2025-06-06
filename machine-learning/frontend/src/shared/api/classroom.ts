import { axiosInstance } from './axios';

export const classroomApi = {
    list: () =>
        axiosInstance.get('/classroom/select'),
};