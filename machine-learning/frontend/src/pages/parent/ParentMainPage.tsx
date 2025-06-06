import { useState } from "react";
import { Menu, User, Plus, Minus } from "lucide-react";
import AnnouncementPanel from "@features/common/announcement/ParentAnnouncementPanel";
import ParentAlbum from "@features/common/album/ParentAlbum.tsx";
import urLogo from "@/shared/assets/ur.png";

const days = ["일", "월", "화", "수", "목", "금", "토"];

const ParentMainPage = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [isAlbumExpanded, setIsAlbumExpanded] = useState(false);
  const [isNoticeExpanded, setIsNoticeExpanded] = useState(true);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-4" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isToday = today.toDateString() === thisDate.toDateString();
      const isSelected =
        selectedDate.toDateString() === thisDate.toDateString();

      cells.push(
        <div
          key={i}
          onClick={() => setSelectedDate(thisDate)}
          className={`h-6 w-6 flex items-center justify-center rounded-full cursor-pointer
            ${isSelected ? "bg-blue-500 text-white" : "text-gray-800"}
            ${isToday ? "underline underline-offset-3" : ""}
            text-sm hover:bg-blue-100 transition`}
        >
          {i}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-full min-h-screen bg-[#EAF0FF] flex flex-col items-center">
      <div className="w-full max-w-sm p-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="bg-white rounded-full p-1 shadow">
            <Menu className="w-6 h-6" />
          </div>
          <img src={urLogo} alt="UR 로고" className="h-20 " />
          <div className="bg-white rounded-full p-1 shadow">
            <User className="w-6 h-6" />
          </div>
        </div>

        {/* 공지사항 영역 (토글 가능) */}
        <div
            className={`bg-white rounded-xl p-4 shadow transition-all duration-300 ${
                isNoticeExpanded ? "h-auto" : "h-[80px] overflow-hidden"
            }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">공지사항</h2>
            <button
                onClick={() => setIsNoticeExpanded(!isNoticeExpanded)}
                className="text-lg bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-200"
            >
              {isNoticeExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </button>
          </div>
          {isNoticeExpanded && <AnnouncementPanel limit={3} />}
        </div>

        {/* 달력 영역 (토글 가능) */}
        <div
          className={`bg-white rounded-xl p-4 shadow transition-all duration-300 ${
            isCalendarExpanded ? "h-auto" : "h-[80px] overflow-hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">
              {today.getFullYear()}.
              {String(today.getMonth() + 1).padStart(2, "0")}.
              {String(today.getDate()).padStart(2, "0")}
            </h2>
            <button
              onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
              className="text-lg bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-200"
            >
              {isCalendarExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </button>
          </div>

          {isCalendarExpanded && (
            <>
              <div className="flex items-center justify-between mb-2">
                <button onClick={prevMonth} className="text-xl">
                  {"<"}
                </button>
                <div className="font-semibold text-lg">
                  {currentDate.getFullYear()}.
                  {String(currentDate.getMonth() + 1).padStart(2, "0")}.
                </div>
                <button onClick={nextMonth} className="text-xl">
                  {">"}
                </button>
                <button
                  onClick={goToday}
                  className="ml-2 px-2 py-1 text-sm bg-gray-200 rounded"
                >
                  오늘
                </button>
              </div>

              <div className="grid grid-cols-7 text-center font-semibold text-sm text-black mb-1">
                {days.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 text-center gap-y-2">
                {renderCalendar()}
              </div>
            </>
          )}
        </div>


        {/* 앨범 영역 (토글 가능) */}
        <div
          className={`bg-white rounded-xl p-4 shadow transition-all duration-300 ${
            isAlbumExpanded ? "h-auto" : "h-[80px] overflow-hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">앨범</h2>
            <button
              onClick={() => setIsAlbumExpanded(!isAlbumExpanded)}
              className="text-lg bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-200"
            >
              {isAlbumExpanded ? <Minus size={16} /> : <Plus size={16} />}
            </button>
          </div>
          {isAlbumExpanded && <ParentAlbum />}
        </div>
      </div>
    </div>
  );
};

export default ParentMainPage;
