import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminListSessions, Session } from "../api/client";
import "./admin.css";

export default function AdminSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminListSessions()
      .then(({ sessions }) => setSessions(sessions))
      .catch(() => setError("Failed to load sessions."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("ask-buddha-admin-token");
    navigate("/admin");
  };

  return (
    <div className="admin-screen admin-screen-scroll">
      <div className="admin-card admin-card-wide">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-title">Sessions</h1>
            <p className="admin-subtitle">Ask Buddha Admin</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn-secondary" onClick={handleLogout}>
              Logout
            </button>
            <button className="admin-btn" onClick={() => navigate("/admin/sessions/new")}>
              + New Session
            </button>
          </div>
        </div>

        {loading && <p className="admin-muted">Loading…</p>}
        {error && <p className="admin-error">{error}</p>}
        {!loading && !error && sessions.length === 0 && (
          <p className="admin-muted">No sessions yet. Create one to get started.</p>
        )}

        <div className="admin-session-list">
          {sessions.map((s) => (
            <div
              key={s.sessionKey}
              className="admin-session-item"
              onClick={() => navigate(`/admin/sessions/${s.sessionKey}`)}
            >
              <div className="admin-session-key">{s.sessionKey}</div>
              <div className="admin-session-info">
                <span className="admin-session-date">{s.eventDate}</span>
                {s.eventTime && (
                  <span className="admin-session-time">{s.eventTime}</span>
                )}
                {s.venue?.organization && (
                  <span className="admin-session-venue">{s.venue.organization}</span>
                )}
              </div>
              <div className="admin-session-hosts">
                {s.hosts?.map((h, i) => (
                  <span key={i} className="admin-session-host">
                    {h.firstName} {h.lastName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
