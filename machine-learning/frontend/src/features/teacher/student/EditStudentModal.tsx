import type React from "react"
import {useEffect, useRef, useState} from "react"
import {Calendar, Upload, X} from "lucide-react"

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

interface EditStudentModalProps {
    student: Student
    onClose: () => void
    onUpdateStudent: (updatedStudent: Student) => void
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onUpdateStudent }) => {
    const [formData, setFormData] = useState<Student>({
        id: 0,
        name: "",
        class: "",
        age: 0,
        guardian: "",
        phone: "",
        birthdate: "",
        teacher: "",
        notes: "",
        imageUrl: "",
        gender:""
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // 컴포넌트가 마운트될 때 학생 데이터로 폼 초기화
    useEffect(() => {
        setFormData(student)
        if (student.imageUrl) {
            setPreviewImage(student.imageUrl)
        }
    }, [student])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
                setFormData((prev) => ({
                    ...prev,
                    imageUrl: reader.result as string,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdateStudent(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl p-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold">학생 정보 수정</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex gap-10">
                        {/* 왼쪽 섹션 - 이미지 업로드 */}
                        <div className="flex flex-col items-center translate-y-8">
                            <div
                                onClick={handleImageClick}
                                className="w-48 h-48 rounded-lg bg-gray-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                            >
                                {previewImage ? (
                                    <img
                                        src={previewImage || "/placeholder.svg"}
                                        alt="학생 프로필"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <Upload size={28} className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">사진 업로드</span>
                                    </>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            {/*<p className="mt-3 text-sm font-medium">특이사항</p>*/}
                        </div>

                        {/* 오른쪽 섹션 - 학생 정보 입력 폼 */}
                        <div className="flex-1 grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    어린이 이름
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                                    생년월일
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="birthdate"
                                        name="birthdate"
                                        value={formData.birthdate || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="guardian" className="block text-sm font-medium text-gray-700 mb-1">
                                    보호자 성함
                                </label>
                                <input
                                    type="text"
                                    id="guardian"
                                    name="guardian"
                                    value={formData.guardian}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    보호자 번호
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="010-0000-0000"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                                    반
                                </label>
                                <select
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="상상전자반">상상전자반</option>
                                    <option value="창의로봇반">창의로봇반</option>
                                    <option value="미래과학반">미래과학반</option>
                                    <option value="코딩게임반">코딩게임반</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
                                    담당 선생님
                                </label>
                                <select
                                    id="teacher"
                                    name="teacher"
                                    value={formData.teacher || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="서무성">서무성</option>
                                    <option value="김지연">김지연</option>
                                    <option value="박태호">박태호</option>
                                    <option value="이수진">이수진</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 특이사항 입력 영역 - 아래쪽으로 이동 */}
                    <div className="mt-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            특이사항
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes || ""}
                            onChange={handleChange}
                            className="w-full h-36 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="특이사항을 입력하세요..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            수정
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditStudentModal
