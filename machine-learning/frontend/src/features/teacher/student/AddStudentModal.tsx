import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Calendar, Upload, X } from "lucide-react";
import { classroomApi } from "@shared/api/classroom";

export interface Student {
    id: number;
    name: string;
    class: string;          // 선택한 반 id (문자열)
    age: number;
    guardian: string;
    phone: string;
    gender: "MALE" | "FEMALE";  // ⬅️ 추가
    birthdate?: string;
    notes?: string;
    imageUrl?: string;
}

interface Classroom {
    classroomId: number;
    classroomName: string;
}

interface AddStudentModalProps {
    onClose: () => void;
    onAddStudent: (student: Student) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
    /* ----------------------------- form state ----------------------------- */
    const [formData, setFormData] = useState({
        name: "",
        class: "",          // classroomId 문자열
        age: 0,
        guardian: "",
        phone: "",
        birthdate: "",
        gender: "MALE" as "MALE" | "FEMALE",   // 기본 MALE
        notes: "",
        imageUrl: "",
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);

    /* -------------------------- fetch classrooms -------------------------- */
    useEffect(() => {
        classroomApi
            .list()
            .then((res) => {
                const list = res.data.result.classroomList.map((c: any) => ({
                    classroomId: c.classroomId,
                    classroomName: c.classroomName,
                }));
                setClassrooms(list);
                setFormData((prev) => ({
                    ...prev,
                    class: String(list[0]?.classroomId || ""),
                }));
            })
            .catch((err) => console.error("반 목록 조회 실패:", err));
    }, []);

    /* ------------------------------ handlers ------------------------------ */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageClick = () => fileInputRef.current?.click();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
            setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddStudent({
            ...formData,
            id: 0,                    // 임시 id
        });
    };

    /* ------------------------------ render ------------------------------ */
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl p-6">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold">학생 추가</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex gap-10">
                        {/* 사진 업로드 */}
                        <div className="flex flex-col items-center translate-y-8">
                            <div
                                onClick={handleImageClick}
                                className="w-50 h-50 rounded-lg bg-gray-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                            >
                                {previewImage ? (
                                    <img src={previewImage} alt="학생 프로필" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload size={28} className="text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">사진 업로드</span>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* 입력 필드들 */}
                        <div className="flex-1 grid grid-cols-2 gap-6">
                            {/* 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">어린이 이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border rounded-md"
                                />
                            </div>

                            {/* 생년월일 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border rounded-md"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                </div>
                            </div>

                            {/* 보호자 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">보호자 성함</label>
                                <input
                                    type="text"
                                    name="guardian"
                                    value={formData.guardian}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border rounded-md"
                                />
                            </div>

                            {/* 보호자 번호 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">보호자 번호</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="- 없이 입력해주세요"
                                    className="w-full px-4 py-2.5 border rounded-md"
                                />
                            </div>

                            {/* 반 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">반</label>
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border rounded-md"
                                >
                                    {classrooms.map((room) => (
                                        <option key={room.classroomId} value={room.classroomId}>
                                            {room.classroomName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 성별 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border rounded-md"
                                >
                                    <option value="MALE">남</option>
                                    <option value="FEMALE">여</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 특이사항 */}
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full h-36 p-4 border rounded-md resize-none"
                        placeholder="특이사항 입력"
                    />

                    {/* 버튼 */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-full bg-gray-200"
                        >
                            취소
                        </button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-blue-500 text-white">
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
