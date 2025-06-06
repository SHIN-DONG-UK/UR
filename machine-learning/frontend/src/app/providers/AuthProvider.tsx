// src/app/providers/AuthProvider.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { userApi } from "@shared/api/user";

// 1) 공통 역할 타입
type UserRole = "TEACHER" | "PARENT";

// 2) 컨텍스트 인터페이스
interface AuthContextType {
    isAuthenticated: boolean;
    role: UserRole | null;
    loading: boolean;
    login: (token: string, role?: UserRole) => void;
    logout: () => void;
}

// 3) 초기값
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    role: null,
    loading: true,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    /** 앱 재시작(새로고침) 시 토큰 확인 */
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }

        userApi
            .getMyProfile()
            .then((res) => {
                setIsAuthenticated(true);
                setRole(res.data.result.role as UserRole); // ✅ 타입 단언
            })
            .catch(() => {
                localStorage.removeItem("accessToken");
                setIsAuthenticated(false);
                setRole(null);
            })
            .finally(() => setLoading(false));
    }, []);

    /** 로그인 성공 시 호출 */
    const login = (token: string, givenRole?: UserRole) => {
        localStorage.setItem("accessToken", token);
        setIsAuthenticated(true);

        if (givenRole) {
            setRole(givenRole);
        } else {
            userApi.getMyProfile().then((r) => setRole(r.data.result.role as UserRole));
        }
    };

    /** 로그아웃 */
    const logout = () => {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, role, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
