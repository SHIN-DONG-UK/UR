import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import StudentTable from "./StudentTable.tsx";
import StudentPreview from "./StudentPreview.tsx";
import AddStudentModal from "../../teacher/student/AddStudentModal.tsx";
import EditStudentModal from "../../teacher/student/EditStudentModal.tsx";
import DeleteConfirmModal from "../../teacher/student/DeleteConfirmModal.tsx";
import Pagination from "./Pagination.tsx";
import { childApi } from "@shared/api/child.ts";

interface Student {
    id: number;
    name: string;
    class: string;
    age: number;
    guardian: string;
    phone: string;
    birthdate?: string;
    teacher?: string;
    notes?: string;
    imageUrl?: string;
    gender: string;
}

// 필터 타입 정의
type FilterType =
    | "ID"
    | "이름"
    | "반"
    | "나이"
    | "보호자"
    | "전화번호"
    | "전체";

const StudentPage: React.FC = () => {
    /* ───────────────────────
       📌 상태
       ───────────────────────*/
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterType>("전체");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [sortConfig, setSortConfig] = useState<
        | { key: keyof Student; direction: "ascending" | "descending" }
        | null
    >(null);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const studentDropdownRef = useRef<HTMLDivElement>(null);
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    const calcAge = (y: number, m: number, d: number) => {
        const today = new Date();
        const birth = new Date(y, m - 1, d);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    /* ───────────────────────
       📌 초기 데이터 로드
       ───────────────────────*/
    useEffect(() => {
        childApi
            .list()
            .then((res) => {
                const list = (
                    res.data.result.childList as Array<{
                        classRoomName: string;
                        childId: number;
                        childName: string;
                        contact: string;
                        birthDt: [number, number, number];
                        noteText: string | null;
                        parentList: Array<{
                            parentId: number;
                            parentName: string;
                            parentContact: string;
                        }>;
                    }>
                ).map((item) => {
                    const [y, m, d] = item.birthDt;
                    const age = calcAge(y, m, d);
                    const guardians = item.parentList?.length
                        ? item.parentList.map((p) => p.parentName).join(", ")
                        : "";
                    const parentPhone = item.parentList?.length
                        ? item.parentList[0].parentContact
                        : item.contact;

                    return {
                        id: item.childId,
                        name: item.childName,
                        class: String(item.classRoomName),
                        age,
                        guardian: guardians,
                        phone: parentPhone,
                        birthdate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
                        notes: item.noteText ?? "",
                        imageUrl: undefined,
                    } as Student;
                });
                setStudents(list);
            })
            .catch((err) => console.error("학생 목록 조회 실패:", err));
    }, []);

    /* ───────────────────────
       📌 드롭다운 외부 클릭 감지
       ───────────────────────*/
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                studentDropdownRef.current &&
                !studentDropdownRef.current.contains(event.target as Node)
            )
                setShowStudentDropdown(false);
            if (
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(event.target as Node)
            )
                setShowFilterDropdown(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ───────────────────────
       📌 정렬 & 검색
       ───────────────────────*/
    const sortedStudents = useMemo(() => {
        const arr = [...students];
        if (sortConfig) {
            arr.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (sortConfig.key === "id") {
                    return sortConfig.direction === "ascending"
                        ? (aVal as number) - (bVal as number)
                        : (bVal as number) - (aVal as number);
                }
                if (sortConfig.key === "age") {
                    const aNum = Number(String(aVal).replace(/[^0-9]/g, ""));
                    const bNum = Number(String(bVal).replace(/[^0-9]/g, ""));
                    return sortConfig.direction === "ascending" ? aNum - bNum : bNum - aNum;
                }

                const aStr = String(aVal).toLowerCase();
                const bStr = String(bVal).toLowerCase();
                if (aStr < bStr) return sortConfig.direction === "ascending" ? -1 : 1;
                if (aStr > bStr) return sortConfig.direction === "ascending" ? 1 : -1;
                return 0;
            });
        }
        return arr;
    }, [students, sortConfig]);

    const getFieldByFilter = (f: FilterType): keyof Student | null => {
        switch (f) {
            case "ID":
                return "id";
            case "이름":
                return "name";
            case "반":
                return "class";
            case "나이":
                return "age";
            case "보호자":
                return "guardian";
            case "전화번호":
                return "phone";
            default:
                return null; // 전체
        }
    };

    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return sortedStudents;
        const q = searchQuery.toLowerCase();
        const field = getFieldByFilter(selectedFilter);

        return sortedStudents.filter((s) => {
            if (field === null) {
                // 전체 검색
                return (
                    s.id.toString().includes(q) ||
                    s.name.toLowerCase().includes(q) ||
                    s.class.toLowerCase().includes(q) ||
                    String(s.age).includes(q) ||
                    s.guardian.toLowerCase().includes(q) ||
                    s.phone.toLowerCase().includes(q)
                );
            }
            const val = s[field];
            return val ? String(val).toLowerCase().includes(q) : false;
        });
    }, [sortedStudents, searchQuery, selectedFilter]);

    /* ───────────────────────
       📌 페이지네이션
       ───────────────────────*/
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const currentStudents = useMemo(() => {
        const first = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(first, first + itemsPerPage);
    }, [filteredStudents, currentPage, itemsPerPage]);

    /* ───────────────────────
       📌 CRUD
       ───────────────────────*/
    const handleAddStudent = (s: Student) => {
        setStudents((prev) => [...prev, s]);
        childApi
            .create({
                classRoomId: Number(s.class),
                childName: s.name,
                birthDt: s.birthdate,
                contact: s.phone,
                noteText: s.notes,
                gender: s.gender
            })
            .then(() => setShowAddModal(false))
            .catch(console.error);
    };

    const handleUpdateStudent = (s: Student) => {
        setStudents((prev) => prev.map((st) => (st.id === s.id ? s : st)));
        setSelectedStudent(s);
        setShowEditModal(false);
    };

    const handleDeleteConfirm = () => {
        if (!studentToDelete) return;
        setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
        if (selectedStudent?.id === studentToDelete.id) setSelectedStudent(null);
        setShowDeleteModal(false);
        setStudentToDelete(null);
    };

    /* ───────────────────────
       📌 렌더링
       ───────────────────────*/
    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-4 h-full">
                {/* 좌측: 목록 */}
                <div className="flex-1 flex flex-col">
                    {/* --- 상단 툴바 --- */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* 검색 입력 */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder={
                                    selectedFilter === "전체" ? "전체 검색..." : `${selectedFilter} 검색...`
                                }
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* 학생/선생님/보호자 드롭다운 */}
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={studentDropdownRef}>
                                <button
                                    className="bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-300 active:bg-blue-400 transition-colors active:scale-95"
                                    onClick={() => setShowStudentDropdown((p) => !p)}
                                >
                                    학생
                                    <ChevronDown size={16} />
                                </button>

                                {showStudentDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                        {["학생", "선생님", "보호자"].map((label) => (
                                            <button
                                                key={label}
                                                className="w-full text-left px-4 py-2 hover:bg-blue-50"
                                                onClick={() => setShowStudentDropdown(false)}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 필터 드롭다운 */}
                            <div className="relative" ref={filterDropdownRef}>
                                <button
                                    className="bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-300 active:bg-blue-400 transition-colors active:scale-95"
                                    onClick={() => setShowFilterDropdown((p) => !p)}
                                >
                                    Filter : {selectedFilter}
                                    <ChevronDown size={16} />
                                </button>

                                {showFilterDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                                        {[
                                            "전체",
                                            "ID",
                                            "이름",
                                            "반",
                                            "나이",
                                            "보호자",
                                            "전화번호",
                                        ].map((f) => (
                                            <button
                                                key={f}
                                                className="w-full text-left px-4 py-2 hover:bg-blue-50"
                                                onClick={() => {
                                                    setSelectedFilter(f as FilterType);
                                                    setShowFilterDropdown(false);
                                                    setSearchQuery("");
                                                }}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 학생 추가 */}
                            <button
                                className="bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-300 active:bg-blue-400 transition-colors active:scale-95"
                                onClick={() => setShowAddModal(true)}
                            >
                                학생 추가 +
                            </button>

                            {/* 보기 모드 (svg 원본 방식) */}
                            <div className="flex items-center gap-1 ml-2">
                                <button
                                    className={`p-2 rounded-lg border ${
                                        viewMode === "list" ? "bg-blue-100 border-blue-300" : "bg-white border-gray-200"
                                    }`}
                                    onClick={() => setViewMode("list")}
                                >
                                    {/* list 아이콘 */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="8" x2="21" y1="6" y2="6" />
                                        <line x1="8" x2="21" y1="12" y2="12" />
                                        <line x1="8" x2="21" y1="18" y2="18" />
                                        <line x1="3" x2="3" y1="6" y2="6" />
                                        <line x1="3" x2="3" y1="12" y2="12" />
                                        <line x1="3" x2="3" y1="18" y2="18" />
                                    </svg>
                                </button>

                                <button
                                    className={`p-2 rounded-lg border ${
                                        viewMode === "grid" ? "bg-blue-100 border-blue-300" : "bg-white border-gray-200"
                                    }`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    {/* grid 아이콘 */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                        <line x1="3" x2="21" y1="9" y2="9" />
                                        <line x1="3" x2="21" y1="15" y2="15" />
                                        <line x1="9" x2="9" y1="3" y2="21" />
                                        <line x1="15" x2="15" y1="3" y2="21" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- 학생 목록 --- */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-auto">
                            <StudentTable
                                students={currentStudents}
                                onSelectStudent={setSelectedStudent}
                                selectedStudent={selectedStudent}
                                viewMode={viewMode}
                                onDeleteClick={(s, e) => {
                                    e.stopPropagation();
                                    setStudentToDelete(s);
                                    setShowDeleteModal(true);
                                }}
                                onEditClick={(s, e) => {
                                    e.stopPropagation();
                                    setStudentToEdit(s);
                                    setShowEditModal(true);
                                }}
                                onSort={(key) => {
                                    let dir: "ascending" | "descending" = "ascending";
                                    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending")
                                        dir = "descending";
                                    setSortConfig({ key, direction: dir });
                                }}
                                sortConfig={sortConfig}
                            />
                        </div>

                        {/* 페이지네이션 */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">페이지당 항목:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded-md text-sm p-1"
                                >
                                    {[5, 10, 15, 20].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(p) => setCurrentPage(p)}
                            />

                            <div className="text-sm text-gray-500">
                                총 {filteredStudents.length}명 중{" "}
                                {filteredStudents.length > 0
                                    ? (currentPage - 1) * itemsPerPage + 1
                                    : 0}
                                -
                                {Math.min(currentPage * itemsPerPage, filteredStudents.length)}명
                            </div>
                        </div>
                    </div>
                </div>

                {/* 우측: 미리보기 */}
                <div className="w-72 bg-blue-100/50 rounded-3xl p-4 h-full flex flex-col overflow-hidden">
                    <h2 className="text-xl font-medium mb-4">Preview</h2>
                    <StudentPreview student={selectedStudent} onEditClick={() => selectedStudent && setShowEditModal(true)} />
                </div>
            </div>

            {/* --- 모달 영역 --- */}
            {showAddModal && (
                <AddStudentModal
                    onClose={() => setShowAddModal(false)}
                    onAddStudent={handleAddStudent}
                />
            )}

            {showEditModal && studentToEdit && (
                <EditStudentModal
                    student={studentToEdit}
                    onClose={() => setShowEditModal(false)}
                    onUpdateStudent={handleUpdateStudent}
                />
            )}

            {showDeleteModal && studentToDelete && (
                <DeleteConfirmModal
                    student={studentToDelete}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default StudentPage;
