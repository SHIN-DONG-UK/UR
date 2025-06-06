// NavBar.tsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '@/shared/assets/ur.png';

interface SidebarProps {
    currentPage: string;
    onPageChange: (page: string) => void;
}

// 카테고리 타입을 string | null로 정의


const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
    const navigate = useNavigate();


    return (
        <div className="w-[250px] min-h-screen left-0 top-0 flex flex-col bg-[#EEF2FF]">
            <div className="h-[200px] px-6 flex items-center gap-3  flex-col" >
                <img src={logo} style={{width: '120px', marginTop: '20px'}} className="cursor-pointer"
                     onClick={() => {
                    onPageChange('DashBoard');
                    navigate('/');
                }} alt={''}/>
            </div>

            {/* 메뉴 - 스크롤 가능한 영역 */}
            <div className="flex-1 overflow-y-auto">
                <div className="py-5">
                    <div className="mb-4">
                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'DashBoard'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                            <div className={' pl-5 w-full'}>
                                <button
                                    className={`pl-2 cursor-pointer w-full h-12 flex items-center text-[18px] font-medium
                                transition-all duration-200 focus:outline-none
                                ${currentPage === 'DashBoard'
                                        ? 'bg-[#00B074]/15 text-[#00B074]'
                                        : 'text-[#3C4149] hover:bg-[#1428A0]/5 bg-[#EEF2FF]'}`}
                                    onClick={() => {
                                        onPageChange('DashBoard');
                                        navigate('/');
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <HomeIcon color={currentPage === 'DashBoard' ? '#00B074' : '#3C4149'}/>
                                        <span className="">Home</span>
                                    </div>
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'Student'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                            <div className={' pl-5 w-full'}>
                                <button
                                    className={`pl-2 cursor-pointer w-full h-12 flex items-center text-[18px] font-medium
                                        transition-all duration-200 focus:outline-none
                                ${currentPage === 'Student'
                                        ? 'bg-[#00B074]/15 text-[#00B074]'
                                        : 'text-[#3C4149] hover:bg-[#1428A0]/5 bg-[#EEF2FF]'}`}
                                    onClick={() => {
                                        onPageChange('Student')
                                        // navigate('/student');
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <UserIcon color={currentPage === 'Student' ? '#00B074' : '#3C4149'}/>
                                        <span>학생</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'Account'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                            <div className={' pl-5 w-full'}>
                                <button
                                    className={`pl-2 cursor-pointer w-full h-12 flex items-center text-[18px] font-medium
                                        transition-all duration-200 focus:outline-none
                                ${currentPage === 'Account'
                                        ? 'bg-[#00B074]/15 text-[#00B074]'
                                        : 'text-[#3C4149] hover:bg-[#1428A0]/5 bg-[#EEF2FF]'}`}
                                    onClick={() => {
                                        onPageChange('Account')
                                        // navigate('/student');
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <AccountManagementIcon color={currentPage === 'Account' ? '#00B074' : '#3C4149'}/>
                                        <span>계정 등록</span>
                                    </div>
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'Attendance'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                            <div className={' pl-5 w-full'}>
                                <button
                                    className={`pl-2 cursor-pointer w-full h-12 flex items-center text-[18px] font-medium
                                        transition-all duration-200 focus:outline-none
                                ${currentPage === 'Attendance'
                                        ? 'bg-[#00B074]/15 text-[#00B074]'
                                        : 'text-[#3C4149] hover:bg-[#1428A0]/5 bg-[#EEF2FF]'}`}
                                    onClick={() => {
                                        onPageChange('Attendance')
                                        // navigate('/attendance');
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <CalendarIcon color={currentPage === 'Attendance' ? '#00B074' : '#3C4149'}/>
                                        <span>출결 상세</span>
                                    </div>
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'Album'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                            <div className={' pl-5 w-full'}>
                                <button
                                    className={`pl-2 cursor-pointer w-full h-12 flex items-center text-[18px] font-medium
                                        transition-all duration-200 focus:outline-none
                                ${currentPage === 'Album'
                                        ? 'bg-[#00B074]/15 text-[#00B074]'
                                        : 'text-[#3C4149] hover:bg-[#1428A0]/5 bg-[#EEF2FF]'}`}
                                    onClick={() => {
                                        onPageChange('Album')
                                        // navigate('/album');
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <PhotoIcon color={currentPage === 'Album' ? '#00B074' : '#3C4149'}/>
                                        <span>앨범</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'Notification'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                            <div className={' pl-5 w-full'}>
                                <button
                                    className={`pl-2 cursor-pointer w-full h-12 flex items-center text-[18px] font-medium
                                        transition-all duration-200 focus:outline-none
                                ${currentPage === 'Notification'
                                        ? 'bg-[#00B074]/15 text-[#00B074]'
                                        : 'text-[#3C4149] hover:bg-[#1428A0]/5 bg-[#EEF2FF]'}`}
                                    onClick={() => {
                                        onPageChange('Notification')
                                        // navigate('/notification');
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        <NotificationsIcon
                                            color={currentPage === 'Notification' ? '#00B074' : '#3C4149'}/>
                                        <span>공지사항</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className={'h-12 overflow-hidden'}
                                 style={currentPage === 'Chat'
                                     ? {
                                         width: '6px',
                                         background: '#00B074',
                                         borderTopRightRadius: '87px',
                                         borderBottomRightRadius: '87px',
                                         borderTopLeftRadius: '0px',
                                         borderBottomLeftRadius: '0px',
                                     }
                                     : {
                                         width: '6px', // 기본 너비는 유지
                                         background: 'transparent', // 배경 없애기
                                     }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserIcon = ({color}: { color: string }) => (
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
        <path
            d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
    </svg>
);
const HomeIcon = ({color}: { color: string }) => (
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
        <path
            d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>

    </svg>
)
const CalendarIcon = ({color}: { color: string }) => (
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
        <path
            d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
    </svg>
)
const PhotoIcon = ({color}: { color: string }) => (
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
        <path
            d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/>
    </svg>
)
const NotificationsIcon = ({color}: { color: string }) => (
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
        <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
    </svg>

)

//
const AccountManagementIcon = ({color}: { color: string }) => (
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill={color}>
        <path
            d="M400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm560 40-12-60q-12-5-22.5-10.5T584-204l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-460l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T732-180l-12 60h-80Zm40-120q33 0 56.5-23.5T760-320q0-33-23.5-56.5T680-400q-33 0-56.5 23.5T600-320q0 33 23.5 56.5T680-240ZM400-560q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Z"/>
    </svg>
)



export default Sidebar;