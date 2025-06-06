// src/features/teacher/components/TeacherMainTemplate.tsx
import React, {useState} from 'react';
import NavBar from "@ui/organisms/NavBar/NavBar.tsx";
// import PublicHeader from "@components/organisms/PublicHeader/PublicHeader.tsx";
import TeacherPageContent from "@features/teacher/TeacherPageContent.tsx";


const TeacherMainTemplate: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('DashBoard');

    return (
        <div className="min-h-screen bg-indigo-300/75 flex">
                <NavBar currentPage={currentPage} onPageChange={setCurrentPage}/>

            <div className="flex-1 flex flex-col">
                {/*<div className="h-[0px] flex-shrink-0">*/}
                {/*    <PublicHeader/>*/}
                {/*</div>*/}

                <div className="flex-1 overflow-auto px-8 py-2">
                    <TeacherPageContent
                        currentPage={currentPage}
                        onChangePage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};


export default TeacherMainTemplate;