import type React from "react"
import {ArrowDown, ArrowUp, Pencil, Trash} from "lucide-react"

interface Student {
    id: number
    name: string
    class: string
    age: number
    guardian: string
    phone: string
    birthdate?: string
    teacher?: string
    notes?: string
    imageUrl?: string
    gender: string
}

interface StudentTableProps {
    students: Student[]
    onSelectStudent: (student: Student) => void
    selectedStudent: Student | null
    viewMode: "list" | "grid"
    onDeleteClick: (student: Student, e: React.MouseEvent) => void
    onEditClick: (student: Student, e: React.MouseEvent) => void
    onSort: (key: keyof Student) => void
    sortConfig: {
        key: keyof Student
        direction: "ascending" | "descending"
    } | null
}

const StudentTable: React.FC<StudentTableProps> = ({
                                                       students,
                                                       onSelectStudent,
                                                       selectedStudent,
                                                       viewMode,
                                                       onDeleteClick,
                                                       onEditClick,
                                                       onSort,
                                                       sortConfig,
                                                   }) => {
    // 정렬 아이콘 렌더링 함수
    const getSortIcon = (columnName: keyof Student) => {
        if (!sortConfig || sortConfig.key !== columnName) {
            return null
        }
        return sortConfig.direction === "ascending" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
    }

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {students.map((student, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-lg p-4 cursor-pointer border ${
                            selectedStudent && selectedStudent.id === student.id
                                ? "border-blue-500 shadow-md"
                                : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => onSelectStudent(student)}
                    >
                        <div className="flex flex-col items-center">
                            {student.imageUrl ? (
                                <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                                    <img
                                        src={student.imageUrl || "/placeholder.svg"}
                                        alt={`${student.name} 프로필`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-500">
                                    {student.name.charAt(0)}
                                </div>
                            )}
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-gray-500">{student.class}</p>
                            <p className="text-sm text-gray-500">{student.age}</p>
                        </div>
                        <div className="mt-2 flex justify-center gap-2">
                            <button
                                className="p-1 text-gray-500 hover:text-blue-500"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEditClick(student, e)
                                }}
                            >
                                <Pencil size={14} />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-red-500" onClick={(e) => onDeleteClick(student, e)}>
                                <Trash size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr className="border-b border-gray-200">
                    <th className="py-3 px-2 text-left w-10">
                        <input type="checkbox" className="rounded" />
                    </th>
                    <th
                        className="py-3 px-2 text-left font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => onSort("id")}
                    >
                        <div className="flex items-center gap-1">
                            Student ID
                            {getSortIcon("id")}
                        </div>
                    </th>
                    <th
                        className="py-3 px-2 text-left font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => onSort("name")}
                    >
                        <div className="flex items-center gap-1">
                            어린이 이름
                            {getSortIcon("name")}
                        </div>
                    </th>
                    <th
                        className="py-3 px-2 text-left font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => onSort("class")}
                    >
                        <div className="flex items-center gap-1">반{getSortIcon("class")}</div>
                    </th>
                    <th
                        className="py-3 px-2 text-left font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => onSort("age")}
                    >
                        <div className="flex items-center gap-1">
                            나이
                            {getSortIcon("age")}
                        </div>
                    </th>
                    <th
                        className="py-3 px-2 text-left font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => onSort("guardian")}
                    >
                        <div className="flex items-center gap-1">
                            보호자 성함
                            {getSortIcon("guardian")}
                        </div>
                    </th>
                    <th
                        className="py-3 px-2 text-left font-medium cursor-pointer hover:bg-gray-50"
                        onClick={() => onSort("phone")}
                    >
                        <div className="flex items-center gap-1">
                            보호자 번호
                            {getSortIcon("phone")}
                        </div>
                    </th>
                    <th className="py-3 px-2 text-left font-medium">Action</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student, index) => (
                    <tr
                        key={index}
                        className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                            selectedStudent && selectedStudent.id === student.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => onSelectStudent(student)}
                    >
                        <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded" />
                        </td>
                        <td className="py-3 px-2">{student.id}</td>
                        <td className="py-3 px-2">{student.name}</td>
                        <td className="py-3 px-2">{student.class}</td>
                        <td className="py-3 px-2">{student.age}</td>
                        <td className="py-3 px-2">{student.guardian}</td>
                        <td className="py-3 px-2">{student.phone}</td>
                        <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                                <button className="p-1 text-gray-500 hover:text-blue-500" onClick={(e) => onEditClick(student, e)}>
                                    <Pencil size={16} />
                                </button>
                                <button className="p-1 text-gray-500 hover:text-red-500" onClick={(e) => onDeleteClick(student, e)}>
                                    <Trash size={16} />
                                </button>

                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default StudentTable
