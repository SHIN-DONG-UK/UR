import type React from "react"
import {Trash2} from "lucide-react"

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
                <div className="text-center mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">계정 삭제</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            이 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 해당 계정의 모든 데이터가 삭제됩니다.
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex justify-center gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        삭제
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
