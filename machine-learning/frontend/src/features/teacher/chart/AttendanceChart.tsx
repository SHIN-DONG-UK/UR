// src/features/teacher/chart/AttendanceChart.tsx

import React, {useState} from "react"
import {Cell, Legend, Pie, PieChart, ResponsiveContainer} from "recharts"
import {ChevronDown} from "lucide-react"

// 반별 데이터 타입 정의
interface ClassData {
    [key: string]: {
        출석: number
        결석: number
        지각: number
    }
}

const AttendanceChart: React.FC = () => {
    // 반 선택 상태
    const [selectedClass, setSelectedClass] = useState<string>("전체")
    const [showDropdown, setShowDropdown] = useState<boolean>(false)

    // 반별 출석 데이터
    const classData: ClassData = {
        전체: { 출석: 20, 결석: 5, 지각: 2 },
        상상전자반: { 출석: 8, 결석: 1, 지각: 1 },
        창의로봇반: { 출석: 5, 결석: 2, 지각: 0 },
        미래과학반: { 출석: 4, 결석: 1, 지각: 1 },
        코딩게임반: { 출석: 3, 결석: 1, 지각: 0 },
    }

    const currentData = classData[selectedClass]
    const data = [
        { name: "출석", value: currentData.출석 },
        { name: "결석", value: currentData.결석 },
        { name: "지각", value: currentData.지각 },
    ]
    const COLORS = ["#4FC3F7", "#EC407A", "#FFD54F"]

    return (
        <div className="flex flex-col h-full">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">출석현황</h2>
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-gray-200 text-sm"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {selectedClass} <ChevronDown size={16} />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                            {Object.keys(classData).map((className) => (
                                <button
                                    key={className}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                        selectedClass === className ? "bg-blue-50 text-blue-600" : ""
                                    }`}
                                    onClick={() => {
                                        setSelectedClass(className)
                                        setShowDropdown(false)
                                    }}
                                >
                                    {className}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 차트 영역: 높이를 h-56(=14rem)로 고정 */}
            <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={0}
                            paddingAngle={1}
                            outerRadius={80}
                            labelLine={false}
                        >
                            {data.map((_, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            iconSize={16}
                            wrapperStyle={{
                                top: "50%",
                                transform: "translateY(-50%)",
                                right: "30px",
                            }}
                            payload={data.map((entry, index) => ({
                                value: `${entry.name}: ${entry.value}`,
                                type: "square" as const,
                                color: COLORS[index % COLORS.length],
                            }))}
                            formatter={(value) => (
                                <span
                                    className="inline-block ml-1 mb-1 text-base font-bold"
                                    style={{ marginBottom: 8 }}
                                >
                  {value}
                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default AttendanceChart
