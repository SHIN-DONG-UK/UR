// src/routes/Router.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@app/providers/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "@pages/SignIn";
import UnauthorizedPage from "@pages/UnauthorizedPage";
import TeacherMainPage from "@pages/teacher/TeacherMainPage";
import ParentMainPage from "@pages/parent/ParentMainPage";
import ParentAlbumDetail from "@features/common/album/ParentAlbumDetail";
import TeacherChildAlbumPage from "@features/common/album/TeacherChildAlbumPage";

function AppRoutes() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<SignIn />} />

      {/* Protected Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
        <Route path="/teacher" element={<TeacherMainPage />} />
        {/* 필요한 추가 teacher 하위 라우트를 여기에 등록 */}
          <Route
              path="/teacher/album/child/:childId"
              element={<TeacherChildAlbumPage />}
          />
      </Route>

      {/* Protected Parent Routes */}
      <Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
        <Route path="/parent" element={<ParentMainPage />} />
        {/* 필요한 추가 parent 하위 라우트를 여기에 등록 */}
        <Route path="/parent/album/:childId" element={<ParentAlbumDetail />} />
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root: 로그인 및 role에 따라 리다이렉트 */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : role === "TEACHER" ? (
            <Navigate to="/teacher" replace />
          ) : (
            <Navigate to="/parent" replace />
          )
        }
      />

      {/* Catch-all: 인증 안 됐으면 /login, 그 외엔 root로 */}
      <Route
        path="*"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
