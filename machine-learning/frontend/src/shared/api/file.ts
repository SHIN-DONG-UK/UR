import { axiosInstance } from './axios';


export const fileApi = {
    upload: (form: FormData) =>
        axiosInstance.post('/file/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};