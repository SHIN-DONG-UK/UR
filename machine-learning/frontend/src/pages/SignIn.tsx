// src/pages/SignIn.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import urImage from "@/shared/assets/ur.png";
import { post } from "@shared/api/rest";
import type { LoginRequest, LoginResponse } from "@shared/api/auth";
import { userApi } from "@shared/api/user.ts";
import { initFCM } from "../ur-firebase/firebase-init";
import { useAuth } from "@app/providers/AuthProvider";     // ✅ 추가

export default function SignIn() {
    const navigate = useNavigate();
    const { login: setAuth } = useAuth();                    // ✅ 컨텍스트 login 함수
    const [loginId, setLoginId] = useState("");
    const [pw, setPw] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginId || !pw) {
            alert("이메일과 비밀번호를 입력하세요.");
            return;
        }

        setLoading(true);
        try {
            // 1) 로그인 요청
            const data = await post<LoginResponse, LoginRequest>("/auth/login", {
                loginId,
                password: pw,
            });

            // 2) 컨텍스트에 로그인 상태 반영
            setAuth(data.accessToken, data.role);

            // 3) FCM 토큰 처리 (선택 사항)
            try {
                const fcmToken = await initFCM();
                await userApi.updateFcmToken(fcmToken);
                console.log("✅ FCM 토큰 저장 완료:", fcmToken);
            } catch (err) {
                console.warn("⚠️ FCM 토큰 발급/저장 실패:", err);
                alert("알림 권한을 허용하지 않아 푸시 알림을 받을 수 없습니다.");
            }

            // 4) 공통 진입점으로 이동 → AppRoutes가 role 따라 분기
            navigate("/", { replace: true });
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message ?? "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-screen min-h-screen bg-[#EBEFFF]">
            {/* 모바일 상단 로고 */}
            <section className="flex md:hidden w-full items-center justify-center p-6">
                <img src={urImage} alt="UR logo" className="w-32 h-auto object-contain" />
            </section>

            {/* 로그인 폼 */}
            <section className="relative w-full md:w-2/3 flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
                <form onSubmit={handleSubmit} className="w-full max-w-md md:max-w-[600px]">
                    <h1 className="font-samsung mb-12 text-3xl md:text-5xl font-bold text-[#1A1A1A] text-center">
                        환영합니다!
                    </h1>

                    <label className="block mb-3 text-lg md:text-xl">ID</label>
                    <input
                        required
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="w-full h-12 md:h-14 mb-6 px-4 md:px-6 border-2 border-[#656ED3] rounded-full"
                    />

                    <label className="block mb-3 text-lg md:text-xl">PW</label>
                    <input
                        required
                        type="password"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="w-full h-12 md:h-14 mb-10 px-4 md:px-6 border-2 border-[#656ED3] rounded-full"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 md:h-14 rounded-full bg-[#656ED3] text-white text-base md:text-lg font-samsung hover:bg-[#5a61c8] disabled:opacity-50"
                    >
                        {loading ? "로딩 중…" : "로그인"}
                    </button>
                </form>

                {/* 배경 장식 */}
                <div className="hidden md:block absolute -left-[500px] -bottom-[260px] -rotate-[41deg] -z-10 pointer-events-none">
                    <div className="w-[1100px] h-[260px] bg-[#838CF1] rounded-[230px]" />
                    <div className="w-[1000px] h-[240px] bg-[#AFB3FF] rounded-[230px] -translate-y-4 translate-x-8" />
                </div>
            </section>

            {/* 데스크탑 로고 */}
            <section className="hidden md:flex w-1/3 items-center justify-center bg-[#AFB3FF] p-6">
                <img src={urImage} alt="UR logo" className="w-[400px] h-auto object-contain" />
            </section>
        </div>
    );
}
