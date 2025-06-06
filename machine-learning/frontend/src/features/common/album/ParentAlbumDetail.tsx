import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Menu, User } from "lucide-react";
import urLogo from "@/shared/assets/ur.png";
import { albumApi } from "@shared/api/album";

interface AlbumImage {
  id: string;
  childId?: number;
  src: string;
  alt: string;
  date: string;
  class?: string;
}

// 필요하면 utils/types 쪽에
interface ChildAlbumItem {
  filePath: string[];
  uploadDate: [number, number, number];
}


const ParentAlbumDetail: React.FC = () => {
  const { childId } = useParams();
  const numericId = Number(childId);
  const [images, setImages] = useState<AlbumImage[]>([]);

  // ParentAlbumDetail.tsx (변경된 useEffect 부분만)
  useEffect(() => {
    if (!numericId) return;                       // 잘못된 childId 방어

    albumApi
        .albumDetail({ childId: numericId })
        .then((res) => {
          // ① 안전하게 꺼내기
          const list: ChildAlbumItem[] =
              res.data?.result?.childAlbumItemList ?? [];

          // ② base URL 처리 (뒤 슬래시 정리)
          const base = (import.meta.env.VITE_UPLOAD_PATH || "").replace(/\/$/, "");

          // ③ filePath 펼치기 + 날짜 포맷
          const parsed: AlbumImage[] = list.flatMap((item) => {
            const [y, m, d] = item.uploadDate;
            const dateStr = `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(
                2,
                "0"
            )}`;

            return item.filePath.map((path, idx) => ({
              id: `${y}${m}${d}-${idx}`,          // 고유 key
              src: `${base}/${path}`,            // 업로드 경로
              alt: "앨범 사진",
              date: dateStr,
            }));
          });

          setImages(parsed);
        })
        .catch((err) => {
          console.error("앨범 이미지 조회 실패:", err);
          setImages([]);
        });
  }, [numericId]);



  // 날짜별 그룹핑
  const grouped = images.reduce((acc: Record<string, AlbumImage[]>, img) => {
    const date = img.date;
    acc[date] = acc[date] || [];
    acc[date].push(img);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="w-full min-h-screen bg-[#EAF0FF] flex flex-col items-center">
      <div className="w-full max-w-sm p-4 space-y-4">
        {/* ✅ 헤더 영역 */}
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-full p-1 shadow">
            <Menu className="w-6 h-6" />
          </div>
          <img src={urLogo} alt="UR 로고" className="h-20 " />
          <div className="bg-white rounded-full p-1 shadow">
            <User className="w-6 h-6" />
          </div>
        </div>

        {/* ✅ 앨범 컨텐츠 */}
        <div className="p-4 space-y-6">
          <h1 className="text-xl font-bold mb-2">아이 앨범</h1>
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-sm font-semibold mb-2">{date}</h2>
              <div className="space-y-4">
                {grouped[date].map((img) => (
                  <div
                    key={img.id}
                    className="w-full rounded-lg border p-2 bg-white text-center"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-40 object-contain bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentAlbumDetail;
