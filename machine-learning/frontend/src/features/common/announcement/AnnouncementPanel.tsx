import React, { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { noticeApi } from "@shared/api/notice.ts";

interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
    important?: boolean;
}

interface AnnouncementPanelProps {
    limit?: number;
}

const AnnouncementPanel: React.FC<AnnouncementPanelProps> = ({ limit }) => {
    // 공지사항 목록 상태
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement>({
        id: 0,
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        important: false,
    });

    // 삭제 확인 모달 상태
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);

    // 상세 보기 상태
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // 공지사항 목록 조회 함수
    const fetchAnnouncements = () => {
        noticeApi
            .getList()
            .then(res => {
                const noticeList = res.data.result.noticeList as Array<{
                    noticeId: number;
                    title: string;
                    noticeBody: string;
                    createDttm: [number, number, number, number, number, number];
                    important: number;
                }>;

                // 1) 공지 매핑
                const mapped = noticeList.map(item => {
                    const [y, m, d] = item.createDttm;
                    return {
                        id: item.noticeId,
                        title: item.title,
                        content: item.noticeBody,
                        date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
                        important: item.important === 1,
                    };
                });

                // 2) 최신순 정렬 (id 내림차순)
                const sorted = mapped.sort((a, b) => b.id - a.id);

                // 3) limit이 있으면 상위 limit개만
                const limited = typeof limit === "number"
                    ? sorted.slice(0, limit)
                    : sorted;

                // 4) 상태에 반영
                setAnnouncements(limited);
            })
            .catch(err => {
                console.error("공지사항 목록 조회 실패:", err);
            });
    };


    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // 공지사항 추가 모달 열기
    const openCreateModal = () => {
        setModalMode("create");
        setCurrentAnnouncement({
            id: 0,
            title: "",
            content: "",
            date: new Date().toISOString().split("T")[0],
            important: false,
        });
        setShowModal(true);
    };

    // 공지사항 수정 모달 열기
    const openEditModal = (announcement: Announcement) => {
        setModalMode("edit");
        setCurrentAnnouncement({ ...announcement });
        setShowModal(true);
    };

    // 공지사항 삭제 확인 모달 열기
    const openDeleteModal = (id: number) => {
        setAnnouncementToDelete(id);
        setShowDeleteModal(true);
    };

    // 공지사항 저장 (추가 또는 수정)
    const saveAnnouncement = () => {
        const apiCall =
            modalMode === "create"
                ? noticeApi.create({ title: currentAnnouncement.title, noticeBody: currentAnnouncement.content})
                : noticeApi.update({ noticeId: currentAnnouncement.id, title: currentAnnouncement.title, noticeBody: currentAnnouncement.content });

        apiCall
            .then(() => {
                setShowModal(false);
                fetchAnnouncements();  // ↩️ 등록/수정 완료 시 목록 갱신
            })
            .catch(console.error);
    };

    // 공지사항 삭제
    const deleteAnnouncement = () => {
        if (announcementToDelete != null) {
            noticeApi
                .remove({ noticeId: announcementToDelete })
                .then(() => {
                    setShowDeleteModal(false);
                    if (expandedId === announcementToDelete) setExpandedId(null);
                    fetchAnnouncements();
                })
                .catch(err => {
                    console.error("공지사항 삭제 실패:", err);
                });
        }
    };

    // 공지사항 토글 (확장/축소)
    const toggleAnnouncement = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">공지사항</h2>
                <button
                    onClick={openCreateModal}
                    className="text-2xl bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-200"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* 공지사항 목록 */}
            <div className="flex-1 overflow-auto">
                <div className="space-y-3">
                    {announcements.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">등록된 공지사항이 없습니다.</div>
                    ) : (
                        announcements.map(announcement => (
                            <div
                                key={announcement.id}
                                className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${
                                    announcement.important ? "border-red-400" : "border-blue-400"
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 cursor-pointer" onClick={() => toggleAnnouncement(announcement.id)}>
                                        <div className="font-medium flex items-center">
                                            {announcement.important && (
                                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            )}
                                            {announcement.title}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{announcement.date}</div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                openEditModal(announcement);
                                            }}
                                            className="p-1 text-gray-400 hover:text-blue-500"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                openDeleteModal(announcement.id);
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                {expandedId === announcement.id && (
                                    <div className="mt-2 pt-2 border-t text-sm text-gray-700">{announcement.content}</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 공지사항 추가/수정 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{modalMode === "create" ? "공지사항 추가" : "공지사항 수정"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* 제목 입력 */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    제목
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={currentAnnouncement.title}
                                    onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="공지사항 제목"
                                />
                            </div>

                            {/* 내용 입력 */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    내용
                                </label>
                                <textarea
                                    id="content"
                                    value={currentAnnouncement.content}
                                    onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="공지사항 내용"
                                />
                            </div>

                            {/* 날짜 입력 */}
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    날짜
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={currentAnnouncement.date}
                                    onChange={e => setCurrentAnnouncement({ ...currentAnnouncement, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* 중요 공지 체크박스 */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="important"
                                    checked={currentAnnouncement.important || false}
                                    onChange={e =>
                                        setCurrentAnnouncement({
                                            ...currentAnnouncement,
                                            important: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="important" className="ml-2 block text-sm text-gray-700">
                                    중요 공지로 표시
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={saveAnnouncement}
                                disabled={!currentAnnouncement.title.trim() || !currentAnnouncement.content.trim()}
                                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                                    !currentAnnouncement.title.trim() || !currentAnnouncement.content.trim()
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {modalMode === "create" ? "추가" : "수정"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
                        <div className="text-center mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">공지사항 삭제</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-center gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={deleteAnnouncement}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementPanel;
