import type React from "react"

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
}

interface StudentPreviewProps {
    student: Student | null
    onEditClick: (student: Student) => void
}

const StudentPreview: React.FC<StudentPreviewProps> = ({ student, onEditClick }) => {
    if (!student) {
        return (
            <div className="bg-white/95 rounded-2xl p-4 flex-1 flex items-center justify-center border-sky-50">
                <p className="text-gray-400">학생을 선택해주세요</p>
            </div>
        )
    }

    return (
        <div className="bg-white/95 rounded-2xl p-4 border-sky-50 flex-1 overflow-y-auto">
            <div className="flex flex-col items-center mb-4">
                {student.imageUrl ? (
                    <div className="w-24 h-24 mb-2 rounded-full overflow-hidden">
                        <img
                            src={student.imageUrl || "/placeholder.svg"}
                            alt={`${student.name} 프로필`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-blue-100 rounded-full mb-2 flex items-center justify-center text-blue-500 text-2xl font-bold">
                        {student.name.charAt(0)}
                    </div>
                )}
                <h3 className="text-lg font-bold mt-2">{student.name}</h3>
                <p className="text-sm text-blue-500 font-medium">{student.class}</p>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <span className="text-gray-500">학생 ID:</span>
                    <span className="font-medium">{student.id}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <span className="text-gray-500">생년월일:</span>
                    <span className="font-medium">{student.birthdate || "정보 없음"}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <span className="text-gray-500">보호자:</span>
                    <span className="font-medium">{student.guardian}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <span className="text-gray-500">연락처:</span>
                    <span className="font-medium">{student.phone}</span>
                </div>

                {student.teacher && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-500"
                            >
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        </div>
                        <span className="text-gray-500">담당 선생님:</span>
                        <span className="font-medium">{student.teacher}</span>
                    </div>
                )}

                {student.notes && (
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                >
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </div>
                            <span className="text-gray-500">특이사항:</span>
                        </div>
                        <p className="ml-7 text-sm">{student.notes}</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-center gap-2">
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    onClick={() => onEditClick(student)}
                >
                    상세 정보
                </button>
            </div>
        </div>
    )
}

export default StudentPreview
