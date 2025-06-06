// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@app/providers/AuthProvider';

interface Props {
    allowedRoles?: ('TEACHER'|'PARENT')[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
    const { isAuthenticated, role, loading } = useAuth();
    if (loading) return <div>Loading…</div>;

    if (!isAuthenticated) {
        // 로그인 전 → 로그인 페이지로
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role!)) {
        // 권한 없는 role → 권한없음 페이지로
        return <Navigate to="/unauthorized" replace />;
    }

    // 접근 허용
    return <Outlet />;
}
