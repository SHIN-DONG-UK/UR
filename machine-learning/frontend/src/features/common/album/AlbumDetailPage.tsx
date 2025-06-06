import type React from "react"
import {useEffect, useMemo, useState} from "react"
import {ArrowLeft, Calendar, Edit, Plus, Search, Trash2, Users} from "lucide-react"
import studentImage from "@/shared/assets/student2.png"
import AlbumModal from "./AlbumModal.tsx"
import Pagination from "@ui/common/Pagination.tsx"

interface AlbumImage {
    id: string
    src: string
    alt: string
    date: string
    class?: string
    title?: string
}

interface AlbumDetailPageProps {
    sectionTitle: string
    sectionImages: AlbumImage[]
    onBack: () => void
    onUpdateImages: (images: AlbumImage[]) => void
}

// 학기 타입 정의
type Semester = "전체" | `${string}년 ${1 | 2}학기`

const AlbumDetailPage: React.FC<AlbumDetailPageProps> = ({ sectionTitle, sectionImages, onBack, onUpdateImages }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClass, setSelectedClass] = useState<string>("전체")
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<"add" | "edit">("add")
    const [selectedImage, setSelectedImage] = useState<AlbumImage | null>(null)

    // 이미지 목록 상태 관리 - 부모로부터 전달받은 이미지로 초기화
    const [images, setImages] = useState<AlbumImage[]>(sectionImages)

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1)
    const imagesPerPage = 6 // 한 페이지에 표시할 이미지 수

    // 년/학기 필터 상태
    const [selectedSemester, setSelectedSemester] = useState<Semester>("전체")

    // 사용 가능한 년/학기 목록 생성
    const semesters = useMemo(() => {
        const years = Array.from(new Set(images.map((img) => (img.date ? new Date(img.date).getFullYear() : null)))).filter(
            (year): year is number => year !== null,
        )

        const semesterList: Semester[] = ["전체"]

        // 각 연도에 대해 1학기와 2학기 추가
        years.sort((a, b) => b - a) // 최신 연도가 먼저 오도록 정렬

        years.forEach((year) => {
            semesterList.push(`${year}년 1학기`)
            semesterList.push(`${year}년 2학기`)
        })

        return semesterList
    }, [images])

    // 반 목록 생성 (중복 제거)
    const classes = useMemo(() => {
        const uniqueClasses = Array.from(
            new Set(images.map((img) => img.class).filter((c): c is string => !!c && c !== "전체")),
        )

        // 가나다 순 정렬
        uniqueClasses.sort((a, b) => a.localeCompare(b, "ko"))

        return ["전체", ...uniqueClasses]
    }, [images])

    // 이미지 추가 모달 열기
    const openAddModal = () => {
        setModalType("add")
        setSelectedImage(null)
        setShowModal(true)
    }

    // 이미지 수정 모달 열기
    const openEditModal = (image: AlbumImage) => {
        setModalType("edit")
        setSelectedImage(image)
        setShowModal(true)
    }

    // 이미지 삭제 처리
    const handleDeleteImage = (imageId: string) => {
        const updatedImages = images.filter((img) => img.id !== imageId)
        setImages(updatedImages)
        onUpdateImages(updatedImages) // 부모 컴포넌트에 변경 알림
    }

    // 이미지 추가 또는 수정 처리
    const handleSaveImage = (image: AlbumImage) => {
        let updatedImages: AlbumImage[]

        if (modalType === "add") {
            // 새 이미지 추가
            const newId = `img-${Date.now()}`
            const newImage = {
                ...image,
                id: newId,
                // 이미지가 없으면 기본 이미지 사용
                src: image.src || studentImage,
            }
            updatedImages = [...images, newImage]
        } else {
            // 기존 이미지 수정
            updatedImages = images.map((img) => (img.id === image.id ? image : img))
        }

        setImages(updatedImages)
        onUpdateImages(updatedImages) // 부모 컴포넌트에 변경 알림
        setShowModal(false)
    }

    // 날짜가 선택된 학기에 해당하는지 확인하는 함수
    const isDateInSemester = (dateStr: string, semester: Semester): boolean => {
        if (semester === "전체") return true

        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // JavaScript의 월은 0부터 시작

        // "2025년 1학기" 형식에서 연도와 학기 추출
        const match = semester.match(/(\d{4})년 (\d)학기/)
        if (!match) return false

        const semesterYear = Number.parseInt(match[1])
        const semesterNum = Number.parseInt(match[2])

        // 연도가 일치하고
        if (year === semesterYear) {
            // 1학기(1-6월) 또는 2학기(7-12월)에 해당하는지 확인
            if (semesterNum === 1 && month >= 1 && month <= 6) return true
            if (semesterNum === 2 && month >= 7 && month <= 12) return true
        }

        return false
    }

    // 검색어, 반, 학기로 필터링 및 최신순 정렬
    const filteredImages = useMemo(() => {
        // 먼저 필터링
        const filtered = images.filter((image) => {
            const matchesSearch =
                image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                false
            const matchesClass = selectedClass === "전체" || image.class === selectedClass
            const matchesSemester = image.date ? isDateInSemester(image.date, selectedSemester) : false

            return matchesSearch && matchesClass && matchesSemester
        })

        // 그 다음 최신순 정렬
        return filtered.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0
            const dateB = b.date ? new Date(b.date).getTime() : 0
            return dateB - dateA // 내림차순 정렬 (최신순)
        })
    }, [images, searchTerm, selectedClass, selectedSemester])

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage)

    // 현재 페이지에 표시할 이미지
    const currentImages = useMemo(() => {
        const indexOfLastImage = currentPage * imagesPerPage
        const indexOfFirstImage = indexOfLastImage - imagesPerPage
        return filteredImages.slice(indexOfFirstImage, indexOfLastImage)
    }, [filteredImages, currentPage, imagesPerPage])

    // 페이지 변경 처리
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    // 필터 변경 시 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedClass, selectedSemester])

    // 부모로부터 새 이미지를 받으면 상태 업데이트
    useEffect(() => {
        setImages(sectionImages)
    }, [sectionImages])

    return (
        <div className="bg-white rounded-3xl p-6 h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="뒤로 가기"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold">{sectionTitle}</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* 반 필터 */}
                    <div className="relative flex items-center">
                        <Users size={16} className="absolute left-3 text-gray-400" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {classes.map((cls) => (
                                <option key={cls} value={cls}>
                                    {cls === "전체" ? "전체 반" : cls}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 학기 필터 - 년/학기 형식으로 변경 */}
                    <div className="relative flex items-center">
                        <Calendar size={16} className="absolute left-3 text-gray-400" />
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value as Semester)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {semesters.map((semester) => (
                                <option key={semester} value={semester}>
                                    {semester}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 검색창 */}
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                    </div>

                    {/* 추가 버튼 */}
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <Plus size={16} />
                        <span>사진 추가</span>
                    </button>
                </div>
            </div>

            {/* 반별 구분선 */}
            <div className="mb-4 pb-2 border-b border-gray-200">
                <div className="flex gap-2">
                    {classes.map((cls) => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedClass === cls
                                    ? "bg-blue-100 text-blue-600 font-medium"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {cls === "전체" ? "전체 반" : cls}
                        </button>
                    ))}
                </div>
            </div>

            {/*/!* 학기별 구분선 추가 *!/*/}
            {/*<div className="mb-4 pb-2 border-b border-gray-200">*/}
            {/*    <div className="flex gap-2 flex-wrap">*/}
            {/*        {semesters.map((semester) => (*/}
            {/*            <button*/}
            {/*                key={semester}*/}
            {/*                onClick={() => setSelectedSemester(semester)}*/}
            {/*                className={`px-3 py-1 rounded-full text-sm ${*/}
            {/*                    selectedSemester === semester*/}
            {/*                        ? "bg-blue-100 text-blue-600 font-medium"*/}
            {/*                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                {semester}*/}
            {/*            </button>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 이미지 그리드 */}
            <div className="overflow-auto flex-1">
                <div className="grid grid-cols-3 gap-6">
                    {filteredImages.length === 0 ? (
                        <div className="col-span-3 text-center py-10 text-gray-500">검색 결과가 없습니다.</div>
                    ) : (
                        currentImages.map((image) => (
                            <div key={image.id} className="group relative rounded-lg overflow-hidden bg-gray-100">
                                <div className="aspect-[4/3] relative">
                                    <img
                                        src={typeof image.src === "string" ? image.src : studentImage}
                                        alt={image.alt}
                                        className="w-full h-full object-cover absolute inset-0"
                                        onError={(e) => {
                                            // 이미지 로드 실패 시 기본 이미지로 대체
                                            e.currentTarget.src = studentImage
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                                            <button
                                                onClick={() => openEditModal(image)}
                                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                            >
                                                <Edit size={16} className="text-gray-700" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                            >
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white">
                                    {/* 제목 표시 */}
                                    <h3 className="font-medium text-sm mb-1">{image.title || image.alt}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500">{image.date}</p>
                                        {image.class && (
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{image.class}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 페이지네이션 */}
            {filteredImages.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredImages.length}
                    itemsPerPage={imagesPerPage}
                    onPageChange={handlePageChange}
                />
            )}

            {/* 사진 추가/수정 모달 */}
            {showModal && (
                <AlbumModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    type={modalType}
                    sectionTitle={sectionTitle}
                    image={selectedImage}
                    onSave={handleSaveImage}
                />
            )}
        </div>
    )
}

export default AlbumDetailPage
