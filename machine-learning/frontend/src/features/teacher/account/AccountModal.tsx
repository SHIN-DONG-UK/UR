import type React from "react"
import {Mail, Phone, User, X} from "lucide-react"
import type {GuardianAccount} from "./types"

interface AccountModalProps {
    isOpen: boolean
    onClose: () => void
    mode: "create" | "edit"
    account: GuardianAccount
    onChange: (account: GuardianAccount) => void
    onSave: (account: GuardianAccount) => void
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, mode, account, onChange, onSave }) => {
    if (!isOpen) return null

    const isFormValid =
        account.name.trim() &&
        account.email.trim() &&
        account.phone.trim() &&
        account.studentName

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isFormValid) {
            onSave(account)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{mode === "create" ? "보호자 계정 추가" : "보호자 계정 수정"}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이름 입력 */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            이름
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                value={account.name}
                                onChange={(e) => onChange({ ...account, name: e.target.value })}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="보호자 이름"
                            />
                            <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* 이메일 입력 */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            이메일
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={account.email}
                                onChange={(e) => onChange({ ...account, email: e.target.value })}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example@email.com"
                            />
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* 전화번호 입력 */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            전화번호
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="phone"
                                value={account.phone}
                                onChange={(e) => onChange({ ...account, phone: e.target.value })}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="010-0000-0000"
                            />
                            <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* 학생 이름 입력 */}
                    <div>
                        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                            학생 이름
                        </label>
                        <input
                            type="text"
                            id="studentName"
                            value={account.studentName}
                            onChange={(e) => onChange({ ...account, studentName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="학생 이름"
                        />
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
                            type="submit"
                            disabled={!isFormValid}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {mode === "create" ? "추가" : "수정"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AccountModal
