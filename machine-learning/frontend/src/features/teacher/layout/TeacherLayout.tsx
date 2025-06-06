// @src/components/layout/TeacherLayout.tsx

import {TeacherLayoutProps} from "@features/teacher/layout/TeacherLayout.type.ts";

const TeacherLayout = ({ width = 'full', height = 'full', children}: TeacherLayoutProps) => {
    return (
        <div
            className={`bg-white/95 w-${width} h-${height} rounded-3xl border-sky-50 p-5`}
        >
            {children}
        </div>
    );
};

export default TeacherLayout;



