import type React from "react"
import TeacherLayout from "@features/teacher/layout/TeacherLayout.tsx"
import Calendar from "@features/common/calendar/Calendar.tsx"
import StudentPage from "@features/common/student/StudentPage.tsx"
import AttendanceChart from "@features/teacher/chart/AttendanceChart.tsx"
import AnnouncementPanel from "@features/common/announcement/AnnouncementPanel.tsx"
import StudentSpecialNotes from "@features/common/student/StudentSpecialNotes.tsx"
import AlbumPage from "@features/common/album/AlbumPage.tsx"
import AccountManagement from "@features/teacher/account/AccountManagement.tsx"

interface Props {
    currentPage: string
    onChangePage: (page: string) => void
}

const TeacherPageContent: React.FC<Props> = ({ currentPage }) => {
    const renderContent = () => {
        switch (currentPage) {
            case "DashBoard":
                return (
                    <div className="h-full flex flex-col flex-1">
                        <div className="flex gap-4 flex-1 m-2">
                            {/* 1번 칸: 달력 */}
                            <TeacherLayout>
                                <Calendar />
                            </TeacherLayout>
                            {/* 2번 칸: 출석 차트 */}
                            <TeacherLayout>
                                <AttendanceChart />
                            </TeacherLayout>
                        </div>

                        <div className="flex gap-4 flex-1 m-2">
                            {/* 3번 칸: 공지사항 */}
                            <TeacherLayout>
                                <AnnouncementPanel limit={3}/>
                            </TeacherLayout>
                            {/* 4번 칸: 원생 특이사항 */}
                            <TeacherLayout>
                                <StudentSpecialNotes />
                            </TeacherLayout>
                        </div>
                    </div>
                )
            case "Student":
                return (
                    <div className="h-full p-2">
                        <TeacherLayout title="학생 관리">
                            <StudentPage />
                        </TeacherLayout>
                    </div>
                )
            case "Account":
                return (
                    <div className="h-full p-2">
                        <TeacherLayout>
                            <AccountManagement />
                        </TeacherLayout>
                    </div>
                )
            case "Attendance":
                return (
                    <div className="h-full p-2">
                        <TeacherLayout title="출석 현황">
                            <AttendanceChart />
                        </TeacherLayout>
                    </div>
                )
            case "Album":
                return (
                    <div className="h-full p-2">
                        <AlbumPage />
                    </div>
                )
            case "Notification":
                return (
                    <div className="h-full p-2">
                        <TeacherLayout>
                            <AnnouncementPanel />
                        </TeacherLayout>
                    </div>
                )
            default:
                return (
                    <div className="h-full p-2">
                        <TeacherLayout />
                    </div>
                )
        }
    }

    return <div className="h-full overflow-hidden">{renderContent()}</div>
}

export default TeacherPageContent
