import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("ask-buddha-admin-token");
  if (!token) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
