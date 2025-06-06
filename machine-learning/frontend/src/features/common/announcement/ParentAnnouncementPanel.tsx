import React, { useEffect, useState } from "react";
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchAnnouncements = () => {
    noticeApi
      .getList()
      .then((res) => {
        const noticeList = res.data.result.noticeList as Array<{
          noticeId: number;
          title: string;
          noticeBody: string;
          createDttm: [number, number, number, number, number, number];
          important: number;
        }>;

        const mapped = noticeList.map((item) => {
          const [y, m, d] = item.createDttm;
          return {
            id: item.noticeId,
            title: item.title,
            content: item.noticeBody,
            date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
              2,
              "0"
            )}`,
            important: item.important === 1,
          };
        });

        const sorted = mapped.sort((a, b) => b.id - a.id);
        const limited =
          typeof limit === "number" ? sorted.slice(0, limit) : sorted;
        setAnnouncements(limited);
      })
      .catch((err) => {
        console.error("공지사항 목록 조회 실패:", err);
      });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const toggleAnnouncement = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${
                  announcement.important ? "border-red-400" : "border-blue-400"
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => toggleAnnouncement(announcement.id)}
                >
                  <div className="font-medium flex items-center">
                    {announcement.important && (
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    )}
                    {announcement.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {announcement.date}
                  </div>
                  {expandedId === announcement.id && (
                    <div className="mt-2 pt-2 border-t text-sm text-gray-700">
                      {announcement.content}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPanel;
