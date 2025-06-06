// src/features/teacher/calendar/Calendar.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const days = ["일", "월", "화", "수", "목", "금", "토"];

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: Date;
  time?: string;
  description?: string;
}

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  // 오늘의 할 일 목록
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "일정 1", completed: false, date: today },
    { id: 2, text: "일정 2", completed: true, date: today },
    { id: 3, text: "일정 3", completed: false, date: today },
  ]);

  // 선택된 할 일 ID
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: "",
    time: "",
    description: "",
  });

  // 모달 외부 클릭 감지를 위한 ref
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

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

  // 할 일 완료 상태 토글
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 할 일 선택
  const selectTodo = (id: number) => {
    setSelectedTodoId(selectedTodoId === id ? null : id);
  };

  // 선택된 할 일 삭제
  const deleteSelectedTodo = () => {
    if (selectedTodoId) {
      setTodos(todos.filter((todo) => todo.id !== selectedTodoId));
      setSelectedTodoId(null);
    }
  };

  // 새 일정 추가
  const addNewTodo = () => {
    if (newTodo.text.trim() === "") return;

    const newId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;

    setTodos([
      ...todos,
      {
        id: newId,
        text: newTodo.text,
        completed: false,
        date: selectedDate,
        time: newTodo.time || undefined,
        description: newTodo.description || undefined,
      },
    ]);

    // 모달 닫고 입력 초기화
    setShowModal(false);
    setNewTodo({
      text: "",
      time: "",
      description: "",
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = currentDate.getDay();

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
                      ${isSelected ? "bg-blue-500 text-white" : "text-gray-800"}
                      ${isToday ? "underline underline-offset-3" : ""}
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
    <div className="flex h-full overflow-hidden">
      {/* 왼쪽: 달력 */}
      <div className="flex-1 overflow-auto">
        <div className="w-full max-w-[300px] p-2 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="text-2xl">
              {"<"}
            </button>
            <div className="text-lg font-bold">
              {currentDate.getFullYear()}.
              {String(currentDate.getMonth() + 1).padStart(2, "0")}.
            </div>
            <button onClick={nextMonth} className="text-2xl">
              {">"}
            </button>
          </div>

          {/* 오늘 날짜 */}
          <div className="mb-4 flex justify-end">
            <div className="bg-gray-100 text-gray-700 px-3 rounded-md text-sm">
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
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

      {/* 오른쪽: 오늘의 할 일 */}
      <div className="flex-1 pl-4 pt-2 overflow-auto">
        <div className="h-full">
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-lg font-bold">오늘의 일정</h2>
          </div>
          <div className="mb-4 flex justify-end">
            <div className="bg-gray-100 text-gray-700 px-3 rounded-md text-sm invisible">
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
            </div>
          </div>
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer
                           ${
                             selectedTodoId === todo.id
                               ? "ring-2 ring-blue-400"
                               : ""
                           }`}
                onClick={() => selectTodo(todo.id)}
              >
                <CheckCircle
                  size={18}
                  className={
                    todo.completed ? "text-green-500" : "text-gray-300"
                  }
                  fill={todo.completed ? "#10B981" : "none"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTodo(todo.id);
                  }}
                />
                <div className="flex-1">
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                  {todo.time && (
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock size={12} className="mr-1" /> {todo.time}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 할 일 추가/삭제 버튼 */}
            <div className="mt-4 flex justify-between">
              <button
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 px-3 py-1.5 bg-blue-50 rounded-md"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} /> 일정 추가
              </button>
              <button
                className={`flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-3 py-1.5 bg-red-50 rounded-md
                          ${
                            !selectedTodoId
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                onClick={deleteSelectedTodo}
                disabled={!selectedTodoId}
              >
                <Trash2 size={16} /> 일정 삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 일정 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">새 일정 추가</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* 일정 제목 */}
              <div>
                <label
                  htmlFor="todo-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  일정 제목
                </label>
                <input
                  type="text"
                  id="todo-title"
                  value={newTodo.text}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, text: e.target.value })
                  }
                  placeholder="일정 제목을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 날짜 표시 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  날짜
                </label>
                <div className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                  <CalendarIcon size={16} className="mr-2 text-gray-500" />
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
                  {selectedDate.getDate()}일
                </div>
              </div>

              {/* 시간 */}
              <div>
                <label
                  htmlFor="todo-time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  시간 (선택사항)
                </label>
                <input
                  type="time"
                  id="todo-time"
                  value={newTodo.time}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 설명 */}
              <div>
                <label
                  htmlFor="todo-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  설명 (선택사항)
                </label>
                <textarea
                  id="todo-description"
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  placeholder="일정에 대한 추가 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
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
                onClick={addNewTodo}
                disabled={!newTodo.text.trim()}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                          ${
                            !newTodo.text.trim()
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
