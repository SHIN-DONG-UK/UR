// src/pages/teacher/AlbumPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";                // ✅
import { ChevronRight, Search, Users } from "lucide-react";
import studentImage from "@/shared/assets/student2.png";
import AlbumDetailPage from "./AlbumDetailPage.tsx";
import { classroomApi } from "@shared/api/classroom.ts";
import { albumApi } from "@shared/api/album.ts";

/* ───────── 인터페이스 ───────── */
interface AlbumSection {
    id: string;
    title: string;
    images: AlbumImage[];
}

interface AlbumImage {
    id: string;
    childId?: number;
    src: string;
    alt: string;
    date: string;
    class?: string;
    title?: string;
}

interface Classroom {
    classroomId: number;
    classroomName: string;
}

const AlbumPage: React.FC = () => {
    /* ───────── 상태 ───────── */
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState("전체");
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const [albumSections, setAlbumSections] = useState<AlbumSection[]>([]);
    const [classes, setClasses] = useState<Classroom[]>([]);

    const navigate = useNavigate();                               // ✅

    /* ───────── 반 목록 ───────── */
    useEffect(() => {
        classroomApi
            .list()
            .then((res) => {
                const list = res.data.result.classroomList.map((c: Classroom) => ({
                    classroomId: c.classroomId,
                    classroomName: c.classroomName,
                }));
                setClasses(list);
            })
            .catch((err) => console.error("반 목록 조회 실패:", err));
    }, []);

    /* ───────── covers → 섹션 생성 ───────── */
    useEffect(() => {
        albumApi
            .covers()
            .then((res) => {
                const { childAlbumCoverList, classAlbumCoverList } = res.data.result;

                const base = (import.meta.env.VITE_UPLOAD_PATH || "").replace(/\/$/, "");

                /* 반 섹션 */
                const classImages: AlbumImage[] = classAlbumCoverList.map((c: any) => ({
                    id: `class-${c.className}`,
                    src: c.thumbnail || studentImage,
                    alt: c.title,
                    date: "",
                    class: c.className,
                    title: c.title,
                }));

                /* 아동 섹션 */
                const childImages: AlbumImage[] = childAlbumCoverList.map((c: any) => ({
                    id: `child-${c.childId}`,
                    childId: c.childId,                              // ✅ childId 주입
                    src: c.thumbnail ? `${base}/${c.thumbnail}` : studentImage,
                    alt: c.title,
                    date: "",
                    class: c.className,
                    title: `${c.title} 활동 사진`,
                }));

                setAlbumSections([
                    { id: "class-covers", title: "반 별 사진", images: classImages },
                    { id: "child-covers", title: "아이 별 사진", images: childImages },
                ]);
            })
            .catch((err) => console.error("covers 조회 실패:", err));
    }, []);

    /* ───────── 유틸 ───────── */
    const getLatestImages = (imgs: AlbumImage[], n = 3) =>
        [...imgs]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, n);

    /* ───────── 상세 페이지 (더보기) ───────── */
    const sectionData = albumSections.find((s) => s.id === selectedSection);
    if (selectedSection && sectionData) {
        return (
            <AlbumDetailPage
                sectionTitle={sectionData.title}
                sectionImages={sectionData.images}
                onBack={() => setSelectedSection(null)}
                onUpdateImages={(imgs) =>
                    setAlbumSections((prev) =>
                        prev.map((s) => (s.id === selectedSection ? { ...s, images: imgs } : s)),
                    )
                }
            />
        );
    }

    /* ───────── 메인 렌더 ───────── */
    return (
        <div className="bg-white rounded-3xl p-6 h-full flex flex-col overflow-hidden">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">SSAFY 유치원 앨범</h1>

                {/* 검색·반 선택 */}
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                        <Users size={16} className="absolute left-3 text-gray-400" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="전체">전체 반</option>
                            {classes.map((cls) => (
                                <option key={cls.classroomId} value={cls.classroomName}>
                                    {cls.classroomName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>
            </div>

            {/* 섹션별 썸네일 */}
            <div className="space-y-8 overflow-auto flex-1">
                {albumSections.map((section) => {
                    /* 반 필터 + 최근 3장 */
                    const filtered = section.images.filter(
                        (img) => selectedClass === "전체" || img.class === selectedClass,
                    );
                    const latestImages = getLatestImages(filtered, 3);

                    return (
                        <div key={section.id}>
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h2 className="text-lg font-medium">{section.title}</h2>
                                <button
                                    onClick={() => setSelectedSection(section.id)}
                                    className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
                                >
                                    더보기 <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {latestImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className="group relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            if (section.id === "child-covers" && img.childId) {
                                                navigate(`/teacher/album/child/${img.childId}`);     // ✅ 이동
                                            }
                                        }}
                                    >
                                        <div className="aspect-[4/3]">
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                                className="w-full h-full object-cover"
                                                onError={(e) =>
                                                    ((e.currentTarget as HTMLImageElement).src = studentImage)
                                                }
                                            />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                                        </div>

                                        <div className="p-3 bg-white">
                                            <h3 className="font-medium text-sm mb-1 truncate">{img.alt}</h3>
                                            {img.class && (
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {img.class}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlbumPage;
