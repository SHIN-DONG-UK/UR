import { axiosInstance } from './axios';

export interface ChildInfo {
    childId: number; classRoomId: number; childName: string;
    gender: string; contact: string; birthDt: string; noteText?: string;
}
export interface GetChildResponse { childList: ChildInfo[]; }
export interface CreateChildRequest {
    classRoomId: number;
    childName: string;
    birthDt: string;
    gender: string;
    contact: string; }
export interface UpdateChildRequest { childId: number; classRoomId?: number; contact?: string; noteText?: string; }
export interface UpdateParentChildRequest { childId: number; parentId: number; }
export interface GetChildDetailRequest { childId: number; }
export interface GetChildDetailResponse { childId: number; classRoomId: number; childName: string; gender: string; contact: string; birthDt: string; noteText?: string; }

export const childApi = {
    list: () =>
        axiosInstance.get('/child/select'),
    create: (data: {
        classRoomId: number;
        childName: string;
        birthDt: string | undefined;
        contact: string;
        noteText: string | undefined
        gender: string;
    }) =>
        axiosInstance.post('/child/creat', data),
    update: (data: UpdateChildRequest) =>
        axiosInstance.post('/child/update', data),
    updateParentChild: (data: UpdateParentChildRequest) =>
        axiosInstance.post('/child/update/parent-child', data),
    detail: (data: GetChildDetailRequest) =>
        axiosInstance.post('/child/detail', data),
};