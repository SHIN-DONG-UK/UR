// @src/components/layout/TeacherLayout.tsx
import {ReactNode} from "react";

export interface TeacherLayoutProps {
  width?: string;
  height?: string;
  children?: ReactNode; // 안에 들어가는 내용
  title?: string
}
