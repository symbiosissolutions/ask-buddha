import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/client";
import "./admin.css";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME as string;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Quick local check before hitting the server
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setError("Invalid credentials.");
      return;
    }

    setLoading(true);
    try {
      const { token } = await adminLogin(username, password);
      sessionStorage.setItem("ask-buddha-admin-token", token);
      navigate("/admin/sessions");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-screen">
      <div className="admin-card">
        <h1 className="admin-title">Admin</h1>
        <p className="admin-subtitle">Ask Buddha</p>

        <form onSubmit={handleSubmit} className="admin-form" style={{ marginTop: "var(--space-6)" }}>
          <div className="admin-field">
            <label className="admin-label">Username</label>
            <input
              className="admin-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Password</label>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn admin-btn-full" type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
