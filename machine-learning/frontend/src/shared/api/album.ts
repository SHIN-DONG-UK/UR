import { axiosInstance, } from './axios';

export interface AlbumListInfo { albumId: number; title: string; thumbnail: string; }
export interface AlbumCover { childId: number; title: string; className: string; thumbnail: string; }
export interface CreateAlbumRequest { fileId: number; targetId: number[]; type: string; }
export interface AlbumDetailRequest { childId: number }

export const albumApi = {
    list: () =>
        axiosInstance.get('/album/select/list'),
    covers: () =>
        axiosInstance.get('/album/select/covers'),
    create: (data: CreateAlbumRequest) =>
        axiosInstance.post('/album/create', data),
    albumDetail: (data: AlbumDetailRequest) =>
        axiosInstance.post('/album/select/child-album-items', data),
};