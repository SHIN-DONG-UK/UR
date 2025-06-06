import type React from "react"
import {ChevronLeft, ChevronRight} from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    // 이전 페이지로 이동
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    // 다음 페이지로 이동
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    // 페이지 번호 계산 로직
    const getPageNumbers = () => {
        const pageNumbers: number[] = []

        if (totalPages <= 5) {
            // 전체 페이지가 5개 이하면 모든 페이지 표시
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else if (currentPage <= 3) {
            // 현재 페이지가 1, 2, 3이면 1, 2, 3, 4, 5 표시
            for (let i = 1; i <= 5; i++) {
                pageNumbers.push(i)
            }
        } else if (currentPage >= totalPages - 2) {
            // 현재 페이지가 마지막에 가까우면 마지막 5개 표시
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // 그 외의 경우 현재 페이지 중심으로 표시
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                pageNumbers.push(i)
            }
        }

        return pageNumbers
    }

    // 현재 표시 중인 아이템 범위 계산
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    if (totalPages === 0) return null

    return (
        <div className="mt-6 relative flex justify-center items-center">
            <div className="flex items-center space-x-2">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                        currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="이전 페이지"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex space-x-1">
                    {/* 페이지 번호 버튼 */}
                    {getPageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                currentPage === pageNum ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                            }`}
                            aria-label={`${pageNum} 페이지로 이동`}
                            aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                        currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-label="다음 페이지"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="absolute right-0 text-sm text-gray-500">
                {totalItems}개 중 {startItem}-{endItem} 표시
            </div>
        </div>
    )
}

export default Pagination
