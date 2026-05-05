import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Chat from "./pages/Chat";
import KeyEntry from "./pages/KeyEntry";
import AdminLogin from "./pages/AdminLogin";
import AdminSessions from "./pages/AdminSessions";
import AdminSessionNew from "./pages/AdminSessionNew";
import AdminSessionDetail from "./pages/AdminSessionDetail";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { checkAccess } from "./hooks/useAccessGuard";

function ChatGate() {
  const [hasAccess, setHasAccess] = useState(() => checkAccess());

  if (!hasAccess) {
    return <KeyEntry onSuccess={() => setHasAccess(true)} />;
  }
  return <Chat />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatGate />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/sessions"
          element={
            <ProtectedAdminRoute>
              <AdminSessions />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/sessions/new"
          element={
            <ProtectedAdminRoute>
              <AdminSessionNew />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/sessions/:key"
          element={
            <ProtectedAdminRoute>
              <AdminSessionDetail />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
