import { axiosInstance } from './axios';

// — Payload / Response 타입 —
export interface UpdateProfileRequest { contact?: string; email?: string; }
export interface UpdatePasswordRequest { newPassword: string; }
export interface CreateParentRequest {
    loginId: string; name: string; email: string; contact: string;
}
export interface ParentInfo { userId: number; name: string; contact: string; email: string; }

// — 사용자 API —
export const userApi = {
    updateProfile: (data: UpdateProfileRequest) =>
        axiosInstance.post('/user/update/profile', data),
    updatePassword: (data: UpdatePasswordRequest) =>
        axiosInstance.post('/user/update/password', data),
    createParent: (data: CreateParentRequest) =>
        axiosInstance.post('/user/create/parent', data),
    getParentList: () =>
        axiosInstance.get('/user/select/parent-list'),
    deleteParent: (parentId: number) =>
        axiosInstance.delete('/user/delete/parent', { params: { parentId } }),
    getMyProfile: () =>
        axiosInstance.get('/user/select/my-profile'),
    updateFcmToken: (token: string) =>
        axiosInstance.get('/user/update/fcm-token', {
            params: { fcmToken: token }
        }),
};