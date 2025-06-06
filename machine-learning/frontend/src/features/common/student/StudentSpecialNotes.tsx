import type React from "react"
import {useEffect, useState} from "react"
import {Briefcase, ChevronLeft, ChevronRight, Droplet, Package} from "lucide-react"
import studentImg from "@/shared/assets/student.png"

interface StudentItem {
    id: number
    name: string
    imageUrl: string
    items: string[]
    notes: string
}

const StudentSpecialNotes: React.FC = () => {
    // 여러 학생 데이터
    const [students] = useState<StudentItem[]>([
        {
            id: 1,
            name: "신동욱",
            imageUrl: studentImg,
            items: ["가방", "물통", "도시락"],
            notes: "알레르기가 있어 급식 시 주의가 필요합니다. 체육 활동 후 천식 증상이 나타날 수 있습니다.",
        },
        {
            id: 2,
            name: "김영수",
            imageUrl: studentImg,
            items: ["가방", "물통"],
            notes: "집중력이 좋으나 쉬는 시간에 활동량이 많아 지치는 경향이 있습니다.",
        },
        {
            id: 3,
            name: "이상철",
            imageUrl: studentImg,
            items: ["가방", "도시락", "우산"],
            notes: "친구들과 잘 어울리며 협동 활동에 적극적으로 참여합니다.",
        },
    ])

    // 현재 표시 중인 학생 인덱스
    const [currentIndex, setCurrentIndex] = useState(0)
    // 자동 슬라이드 타이머
    const [autoSlideTimer, setAutoSlideTimer] = useState<NodeJS.Timeout | null>(null)

    // 이전 학생으로 이동
    const prevStudent = () => {
        setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1))
    }

    // 다음 학생으로 이동
    const nextStudent = () => {
        setCurrentIndex((prev) => (prev === students.length - 1 ? 0 : prev + 1))
    }

    // 자동 슬라이드 시작
    const startAutoSlide = () => {
        if (autoSlideTimer) clearInterval(autoSlideTimer)
        const timer = setInterval(() => {
            nextStudent()
        }, 5000) // 5초마다 다음 학생으로 이동
        setAutoSlideTimer(timer)
    }

    // 자동 슬라이드 정지
    const stopAutoSlide = () => {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer)
            setAutoSlideTimer(null)
        }
    }

    // 컴포넌트 마운트 시 자동 슬라이드 시작
    useEffect(() => {
        startAutoSlide()
        return () => stopAutoSlide() // 컴포넌트 언마운트 시 타이머 정리
    }, [])

    // 현재 표시할 학생
    const currentStudent = students[currentIndex]

    // 아이템에 따른 아이콘 매핑
    const getItemIcon = (item: string) => {
        switch (item.toLowerCase()) {
            case "가방":
                return <Briefcase size={28} className="text-gray-700" />
            case "물통":
                return <Droplet size={28} className="text-gray-700" />
            case "도시락":
                return <Package size={28} className="text-gray-700" />
            default:
                return <Package size={28} className="text-gray-700" />
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">원생 특이사항</h2>
                <div className="text-sm text-gray-500">
                    {currentIndex + 1} / {students.length}
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden" onMouseEnter={stopAutoSlide} onMouseLeave={startAutoSlide}>
                {/* 캐러셀 내용 */}
                <div className="h-full flex">
                    {/* 왼쪽: 사진과 이름 */}
                    <div className="w-1/3 flex flex-col items-center justify-center">
                        <div className="w-28 h-28 rounded-full overflow-hidden mb-3">
                            <img
                                src={currentStudent.imageUrl || "/placeholder.svg"}
                                alt={`${currentStudent.name} 프로필`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-bold">{currentStudent.name}</h3>
                    </div>

                    {/* 오른쪽: 소지품과 특이사항 */}
                    <div className="w-2/3 pl-4">
                        <div className="mb-4">
                            <h4 className="text-base font-medium mb-2">소지품</h4>
                            <div className="flex justify-start gap-6">
                                {currentStudent.items.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        {getItemIcon(item)}
                                        <span className="mt-1 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-base font-medium mb-2">특이사항</h4>
                            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">{currentStudent.notes}</div>
                        </div>
                    </div>
                </div>

                {/* 좌우 화살표 버튼 */}
                <button
                    onClick={prevStudent}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                    aria-label="이전 학생"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={nextStudent}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                    aria-label="다음 학생"
                >
                    <ChevronRight size={20} />
                </button>

                {/* 인디케이터 점 */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-2">
                    {students.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
                            aria-label={`${index + 1}번 학생으로 이동`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudentSpecialNotes
