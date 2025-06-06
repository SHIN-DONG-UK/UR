import type React from "react"
import {X} from "lucide-react"

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

interface DeleteConfirmModalProps {
    student: Student | null
    onClose: () => void
    onConfirm: () => void
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ student, onClose, onConfirm }) => {
    if (!student) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">학생 삭제</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="py-4">
                    <p className="text-center mb-2">
                        <span className="font-bold">{student.name}</span> 학생을 삭제하시겠습니까?
                    </p>
                    <p className="text-center text-sm text-gray-500">이 작업은 되돌릴 수 없습니다.</p>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
