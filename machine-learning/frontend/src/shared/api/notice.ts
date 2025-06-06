import { axiosInstance } from './axios';

// — Payload / Response 타입 —
export interface NoticeInfo {
    noticeId: number; title: string; noticeBody: string; createDttm: string;
}
export interface GetNoticeListResponse { noticeList: NoticeInfo[]; }
export interface CreateNoticeRequest { title: string; noticeBody: string; important: boolean;}
export interface UpdateNoticeRequest { noticeId: number; title: string; noticeBody: string; }
export interface DeleteNoticeRequest { noticeId: number; }

// — 공지사항 API —
export const noticeApi = {
    getList: () =>
        axiosInstance.get('/notice/select/notice-list'),
    create: (data: { title: string; noticeBody: string; }) =>
        axiosInstance.post('/notice/create', data),
    update: (data: UpdateNoticeRequest) =>
        axiosInstance.post('/notice/update', data),
    remove: (data: DeleteNoticeRequest) =>
        axiosInstance.post('/notice/delete', data),
};