import type React from "react"
import {useEffect, useState} from "react"
import {Calendar, Trash2, Type, Upload, Users, X} from "lucide-react"
import studentImage from "@/shared/assets/student2.png"

interface AlbumImage {
    id: string
    src: string
    alt: string
    date: string
    class?: string
    title?: string
}

interface AlbumModalProps {
    isOpen: boolean
    onClose: () => void
    type: "add" | "edit"
    sectionTitle: string
    image?: AlbumImage | null
    onSave: (image: AlbumImage) => void
}

const AlbumModal: React.FC<AlbumModalProps> = ({ isOpen, onClose, type, sectionTitle, image, onSave }) => {
    const [title, setTitle] = useState("")
    const [alt, setAlt] = useState("")
    const [date, setDate] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // 반 목록
    const classes = ["전체", "상상전자반", "창의로봇반", "미래과학반", "코딩게임반"]

    // 수정 모드일 경우 기존 데이터로 초기화
    useEffect(() => {
        if (type === "edit" && image) {
            setTitle(image.title || "")
            setAlt(image.alt)
            setDate(image.date)
            setSelectedClass(image.class || "")
            setPreviewUrl(typeof image.src === "string" ? image.src : null)
        } else {
            // 추가 모드일 경우 초기화
            setTitle("")
            setAlt("")
            setDate(new Date().toISOString().split("T")[0])
            setSelectedClass("")
            setSelectedFile(null)
            setPreviewUrl(null)
        }
    }, [type, image, isOpen])

    if (!isOpen) return null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 이미지 데이터 생성
        const imageData: AlbumImage = {
            id: image?.id || "",
            // 파일이 선택되었으면 previewUrl 사용, 아니면 기본 이미지 사용
            src: previewUrl || studentImage,
            alt: alt || title, // alt가 없으면 title 사용
            title: title,
            date: date,
            class: selectedClass,
        }

        // 선택된 파일 정보 로깅 (실제 사용 예시)
        if (selectedFile) {
            console.log(`파일 업로드: ${selectedFile.name}, 크기: ${selectedFile.size} bytes`)
        }

        // 부모 컴포넌트의 저장 함수 호출
        onSave(imageData)
    }

    const clearFile = () => {
        setSelectedFile(null)
        setPreviewUrl(type === "edit" && image ? (typeof image.src === "string" ? image.src : null) : null)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">
                        {type === "add" ? `${sectionTitle} 사진 추가` : `${sectionTitle} 사진 수정`}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 제목 입력 */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            제목
                        </label>
                        <div className="relative">
                            <Type size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="사진 제목을 입력하세요"
                            />
                        </div>
                    </div>

                    {/* 대체 텍스트 입력 */}
                    <div>
                        <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                            대체 텍스트 (선택사항)
                        </label>
                        <input
                            type="text"
                            id="alt"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이미지 대체 텍스트"
                        />
                    </div>

                    {/* 반 선택 */}
                    <div>
                        <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                            반 선택
                        </label>
                        <div className="relative">
                            <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                id="class"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">반 선택</option>
                                {classes.map((cls) => (
                                    <option key={cls} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 날짜 선택 */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            날짜
                        </label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* 사진 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">사진 업로드</label>
                        {previewUrl ? (
                            <div className="relative">
                                <img
                                    src={previewUrl || studentImage}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-md"
                                    onError={(e) => {
                                        e.currentTarget.src = studentImage
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                                <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">클릭하여 이미지를 업로드하세요</span>
                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF 파일 지원</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* 버튼 */}
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
                            disabled={!title || !date}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                ${!title || !date ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {type === "add" ? "추가" : "수정"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AlbumModal
