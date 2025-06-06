// src/pages/teacher/TeacherChildAlbumPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { albumApi } from "@shared/api/album";
import studentImage from "@/shared/assets/student2.png";

/* ───────── 타입 ───────── */
interface AlbumImage {
    id: string;
    childId: number;
    src: string;
    alt: string;
    date: string; // "YYYY.MM.DD"
}

export default function TeacherChildAlbumPage() {
    /* ───────── routing ───────── */
    const { childId } = useParams();              // URL :childId
    const numericId = Number(childId);
    const navigate = useNavigate();

    /* ───────── state ───────── */
    const [images, setImages] = useState<AlbumImage[]>([]);
    const [loading, setLoading] = useState(true);

    /* ───────── fetch ───────── */
    useEffect(() => {
        if (!numericId) return;

        setLoading(true);
        albumApi
            .albumDetail({ childId: numericId })
            .then((res) => {
                const base = (import.meta.env.VITE_UPLOAD_PATH || "").replace(/\/$/, "");
                const items = res.data.result.childAlbumItemList ?? [];

                /* 응답 펼치기 */
                const parsed: AlbumImage[] = items.flatMap(
                    (item: { filePath: string[]; uploadDate: [number, number, number] }) => {
                        const [y, m, d] = item.uploadDate;
                        const dateStr = `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
                        return item.filePath.map((p, idx) => ({
                            id: `${y}${m}${d}-${idx}`,
                            childId: numericId,
                            src: `${base}/${p}`,
                            alt: "앨범 사진",
                            date: dateStr,
                        }));
                    },
                );

                setImages(parsed);
            })
            .catch((err) => {
                console.error("앨범 이미지 조회 실패:", err);
                setImages([]);
            })
            .finally(() => setLoading(false));
    }, [numericId]);

    /* ───────── render ───────── */
    return (
        <div className="w-full h-screen flex flex-col bg-gray-50">
            {/* 상단 바 */}
            <div className="flex items-center px-8 py-4 bg-white shadow">
                <button onClick={() => navigate(-1)} className="mr-4">
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-2xl font-semibold">아이 앨범 상세</h1>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-auto p-8">
                {loading ? (
                    <p className="text-center text-gray-500">로딩 중…</p>
                ) : images.length === 0 ? (
                    <p className="text-center text-gray-500">사진이 없습니다.</p>
                ) : (
                    /* PC ­– 5열 그리드 */
                    <div className="grid grid-cols-5 gap-6">
                        {images.map((img) => (
                            <div key={img.id} className="flex flex-col gap-2">
                                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) =>
                                            ((e.currentTarget as HTMLImageElement).src = studentImage)
                                        }
                                    />
                                </div>
                                <span className="text-sm text-gray-600">{img.date}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
