import React, { useState } from 'react';

const days = ['일', '월', '화', '수', '목', '금', '토'];

const Calendar: React.FC = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(today);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const startDay = currentDate.getDay();

        const cells = [];

        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-4" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

            const isToday =
                today.getFullYear() === thisDate.getFullYear() &&
                today.getMonth() === thisDate.getMonth() &&
                today.getDate() === thisDate.getDate();

            const isSelected =
                selectedDate.getFullYear() === thisDate.getFullYear() &&
                selectedDate.getMonth() === thisDate.getMonth() &&
                selectedDate.getDate() === thisDate.getDate();

            cells.push(
                <div
                    key={i}
                    onClick={() => setSelectedDate(thisDate)}
                    className={`h-6 w-6 flex items-center justify-center rounded-full cursor-pointer
                      ${isSelected ? 'bg-blue-500 text-white' : 'text-gray-800'}
                      ${isToday ? 'underline underline-offset-3' : ''}
                      text-xs
                      hover:bg-blue-100 transition`}
                >
                    {i}
                </div>
            );
        }

        return cells;
    };


    return (
        <div>
            <div className="">
                <div className="w-full max-w-[300px] p-2 rounded-3xl flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={prevMonth} className="text-2xl">{'<'}</button>
                        <div className="text-lg font-bold">
                            {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, '0')}.
                        </div>
                        <button onClick={nextMonth} className="text-2xl">{'>'}</button>
                    </div>

                    {/* 오늘 날짜 */}
                    <div className="mb-4 flex justify-end">
                        <div className="bg-gray-100 text-gray-700 px-3 rounded-md text-sm">
                            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                        </div>
                    </div>

                    {/* 요일 */}
                    <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
                        {days.map((day) => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>

                    {/* 날짜들 */}
                    <div className="grid grid-cols-7 text-center gap-y-2">
                        {renderCalendar()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
