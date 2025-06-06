import type React from "react"
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // 페이지 번호 배열 생성 (최대 5개)
    const getPageNumbers = () => {
        const pageNumbers = []
        let startPage = Math.max(1, currentPage - 2)
        const endPage = Math.min(totalPages, startPage + 4)

        // 페이지 범위 조정
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4)
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i)
        }

        return pageNumbers
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`p-1 rounded-md ${
                    currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="첫 페이지"
            >
                <ChevronsLeft size={16} />
            </button>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1 rounded-md ${
                    currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="이전 페이지"
            >
                <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                        currentPage === number ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-md ${
                    currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="다음 페이지"
            >
                <ChevronRight size={16} />
            </button>

            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-md ${
                    currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="마지막 페이지"
            >
                <ChevronsRight size={16} />
            </button>
        </div>
    )
}

export default Pagination
