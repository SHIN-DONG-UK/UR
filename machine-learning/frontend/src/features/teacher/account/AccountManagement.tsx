import React, { useEffect, useMemo, useState } from "react"
import { Edit, Search, Trash2, User, UserPlus } from "lucide-react"
import AccountModal from "./AccountModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import Pagination from "@ui/common/Pagination"
import { userApi } from "@shared/api/user.ts"
import {GuardianAccount} from "@features/teacher/account/types.ts";


/** LocalDateTime 배열 → "YYYY-MM-DD HH:mm" */
const formatDate = (arr: number[]): string => {
    if (!Array.isArray(arr) || arr.length < 3) return ""
    const [y, m, d, hh = 0, mm = 0] = arr
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${y}-${pad(m)}-${pad(d)} ${pad(hh)}:${pad(mm)}`
}

const INITIAL_ACCOUNT: GuardianAccount = {
    id: 0,
    name: "",
    email: "",
    phone: "",
    studentName: "",
    createdAt: "",
}

const ITEMS_PER_PAGE = 5

/* ──────────────────────────────────────────────
   📌 컴포넌트
   ──────────────────────────────────────────────*/
const AccountManagement: React.FC = () => {
    const [accounts, setAccounts] = useState<GuardianAccount[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [currentAccount, setCurrentAccount] = useState<GuardianAccount>(INITIAL_ACCOUNT)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [accountToDelete, setAccountToDelete] = useState<number | null>(null)

    /* ───────── 부모 목록 Fetch ───────── */
    useEffect(() => {
        userApi
            .getParentList()
            .then((res) => {
                const parentList = res.data.result.parentList
                const mapped: GuardianAccount[] = parentList.map((p: any) => ({
                    id: p.userId,
                    name: p.name,
                    email: p.email,
                    phone: p.contact,
                    createdAt: formatDate(p.createDttm), // ← 변환
                }))
                setAccounts(mapped)
            })
            .catch(console.error)
    }, [])

    /* ───────── CRUD(로컬) ───────── */
    const resetAccount = () => setCurrentAccount({ ...INITIAL_ACCOUNT })

    const openCreateModal = () => {
        resetAccount()
        setModalMode("create")
        setShowModal(true)
    }

    const openEditModal = (acc: GuardianAccount) => {
        setModalMode("edit")
        setCurrentAccount({ ...acc })
        setShowModal(true)
    }

    const openDeleteModal = (id: number) => {
        setAccountToDelete(id)
        setShowDeleteModal(true)
    }

    const handleSave = (acc: GuardianAccount) => {
        if (modalMode === "create") {
            const newId = accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1
            setAccounts([...accounts, { ...acc, id: newId }])
        } else {
            setAccounts(accounts.map((a) => (a.id === acc.id ? acc : a)))
        }
        setShowModal(false)
    }

    const handleDelete = () => {
        if (accountToDelete !== null) {
            setAccounts(accounts.filter((a) => a.id !== accountToDelete))
            setAccountToDelete(null)
            setShowDeleteModal(false)
        }
    }

    /* ───────── 검색 · 정렬 · 페이지 ───────── */
    const filteredAccounts = useMemo(() => {
        const term = searchTerm.toLowerCase()
        return accounts
            .filter(
                (a) =>
                    a.name.toLowerCase().includes(term) ||
                    a.email.toLowerCase().includes(term) ||
                    a.phone.includes(term),
            )
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // 최신순
    }, [accounts, searchTerm])

    const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE)

    const currentAccounts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredAccounts.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredAccounts, currentPage])

    /* ───────── 렌더 ───────── */
    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">보호자 계정 관리</h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    <UserPlus size={18} />
                    <span>계정 추가</span>
                </button>
            </div>

            {/* 검색 */}
            <div className="flex mb-6">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="이름, 이메일, 연락처 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* 테이블 */}
            <div className="flex-1 overflow-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">등록일</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {currentAccounts.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                등록된 계정이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        currentAccounts.map((acc) => (
                            <tr key={acc.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-500" />
                                        </div>
                                        <span className="ml-4 text-sm font-medium text-gray-900">{acc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{acc.phone}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{acc.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{acc.createdAt}</td>
                                <td className="px-6 py-4 text-right text-sm">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(acc)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="수정"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(acc.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="삭제"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            {filteredAccounts.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredAccounts.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* 모달들 */}
            <AccountModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
                account={currentAccount}
                onChange={setCurrentAccount}
                onSave={handleSave}
            />
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default AccountManagement
