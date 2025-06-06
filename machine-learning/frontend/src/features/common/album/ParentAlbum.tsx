import React, { useEffect, useState } from "react";
import studentImage from "@/shared/assets/student2.png";
import { albumApi } from "@shared/api/album.ts";
import { useNavigate } from "react-router-dom";

interface AlbumImage {
  childId?: number;
  src: string;
  alt: string;
  date: string;
  class?: string;
  title?: string;
}

const ParentAlbum: React.FC = () => {
  const [childImages, setChildImages] = useState<AlbumImage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    albumApi
      .covers()
      .then((res) => {
        const { childAlbumCoverList } = res.data.result as {
          childAlbumCoverList: {
            childId: number;
            title: string;
            className: string;
            thumbnail: string;
          }[];
        };

        const base = import.meta.env.VITE_UPLOAD_PATH || "";

        const images: AlbumImage[] = childAlbumCoverList.map((c) => ({
          childId: c.childId,
          src: c.thumbnail ? `${base}${c.thumbnail}` : studentImage,
          alt: c.title,
          date: "",
          class: c.className,
          title: `${c.title} 활동 사진`,
        }));
        console.log(images);
        console.log(images);
        setChildImages(images);
      })
      .catch((err) => console.error("아이 별 사진 조회 실패:", err));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow w-full">
      <div className="grid grid-cols-3 gap-4">
        {childImages.slice(0, 3).map((img) => (
          <div
            key={img.childId}
            onClick={() => navigate(`/parent/album/${img.childId}`)}
            className="group relative rounded-lg overflow-hidden bg-gray-100"
          >
            <div className="aspect-[4/3] relative">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).src = studentImage)
                }
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="p-2 bg-white">
              <h3 className="font-medium text-sm mb-1 truncate">
                {img.title || img.alt}
              </h3>
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
};

export default ParentAlbum;
