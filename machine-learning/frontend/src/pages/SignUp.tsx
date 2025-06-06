import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import urImage from '@/assets/ur.png';

export default function SignUp() {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const register = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="flex flex-col md:flex-row w-screen min-h-screen bg-[#EBEFFF] overflow-hidden">
            {/* 왼쪽 : 로고 */}
            <div className="flex flex-1 items-center justify-center bg-[#AFB3FF] p-4 md:p-8">
                <img
                    src={urImage}
                    alt="UR Logo"
                    className="w-[200px] md:w-[300px] h-auto object-contain"
                />
            </div>

            {/* 오른쪽 : 폼 */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-8">
                <form onSubmit={register} className="w-full max-w-sm md:max-w-md">
                    <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">
                        회원가입 정보를 입력해 주세요
                    </h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm">이름</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full h-10 px-4 border-2 border-[#656ED3] rounded-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">휴대전화</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full h-10 px-4 border-2 border-[#656ED3] rounded-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-10 px-4 border-2 border-[#656ED3] rounded-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">비밀번호:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-10 px-4 border-2 border-[#656ED3] rounded-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">비밀번호 확인:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full h-10 px-4 border-2 border-[#656ED3] rounded-full"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-10 mt-6 rounded-full bg-[#656ED3] text-white text-sm font-semibold hover:bg-[#5a61c8]"
                    >
                        회원가입
                    </button>

                    <p className="mt-4 text-xs text-center">
                        이미 계정이 있으신가요?{' '}
                        <span
                            onClick={() => nav('/login')}
                            className="font-semibold text-[#656ED3] cursor-pointer hover:underline"
                        >
              로그인
            </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
