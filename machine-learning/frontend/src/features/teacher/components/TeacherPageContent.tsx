import React from 'react';
import TeacherLayout from "@components/layout/TeacherLayout.tsx";
import Calendar from "@features/teacher/calendar/Calendar.tsx";

interface Props {
    currentPage: string;
}

const TeacherPageContent: React.FC<Props> = ({ currentPage }) => {

    const renderContent = () => {
        switch (currentPage) {
            case 'DashBoard':
                return (
                    <div className="h-full flex flex-col flex-1">
                        <div className="flex gap-4 flex-6 m-2">
                            <TeacherLayout >
                                <Calendar/>

                            </TeacherLayout>
                            <TeacherLayout />
                        </div>

                        <div className="flex gap-4 flex-5 m-2">
                            <TeacherLayout />
                            <TeacherLayout/>
                        </div>
                    </div>
                );
            case 'Student':
                return (
                    <div className="h-full p-2">
                        <TeacherLayout/>
                    </div>
                );
            case 'Attendance':
                return (
                    <div className="h-full p-2">
                        <TeacherLayout/>
                    </div>
                );
            case 'Album':
                return (
                    <div className="h-full p-2">
                        <TeacherLayout/>
                    </div>
                );
            case 'Notification':
                return (
                    <div className="h-full p-2">
                        <TeacherLayout/>
                    </div>
                );
            default:
                return (
                    <div className="h-full p-2">
                        <TeacherLayout/>
                    </div>
                );
        }
    };

    return (
        <div className="h-full">
            {renderContent()}
        </div>

        );
    };

export default TeacherPageContent;