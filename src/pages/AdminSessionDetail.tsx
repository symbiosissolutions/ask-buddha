import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetSession } from "../api/client";
import "./admin.css";

interface SessionWithStats {
  sessionKey: string;
  eventDate: string;
  eventTime: string;
  expectedParticipants: number;
  hosts: { firstName: string; lastName: string }[];
  venue: { organization: string; location: string };
  createdAt: string;
  participantCount: number;
  usersWithTime: number;
  totalVisits: number;
  avgDurationMinutes: number;
  avgVisitMinutes: number;
  totalMinutes: number;
}

function formatMinutes(mins: number): string {
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function AdminSessionDetail() {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!key) return;
    adminGetSession(key)
      .then(({ session }) => setSession(session))
      .catch(() => setError("Failed to load session."))
      .finally(() => setLoading(false));
  }, [key]);

  const copyKey = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.sessionKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="admin-screen admin-screen-scroll">
      <div className="admin-card admin-card-wide">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-title">Session Detail</h1>
            <p className="admin-subtitle">Ask Buddha Admin</p>
          </div>
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/sessions")}
          >
            Back
          </button>
        </div>

        {loading && <p className="admin-muted">Loading…</p>}
        {error && <p className="admin-error">{error}</p>}

        {session && (
          <>
            {/* Key display */}
            <div className="admin-key-display">
              <p className="admin-key-label">Event Code</p>
              <div className="admin-key-value">{session.sessionKey}</div>
              <button className="admin-btn-ghost" onClick={copyKey}>
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            {/* Stats */}
            <div className="admin-stats-row">
              <div className="admin-stat">
                <span className="admin-stat-value">{session.participantCount}</span>
                <span className="admin-stat-label">
                  Joined
                  <span className="admin-stat-help" data-tooltip="Unique participants who accessed this session">?</span>
                </span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-value">{session.expectedParticipants}</span>
                <span className="admin-stat-label">
                  Expected
                  <span className="admin-stat-help" data-tooltip="Admin-configured expected participant count">?</span>
                </span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-value">{session.totalVisits ?? "—"}</span>
                <span className="admin-stat-label">
                  Total Visits
                  <span className="admin-stat-help" data-tooltip="Total times the session was opened (one user can visit multiple times)">?</span>
                </span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-value">
                  {session.avgDurationMinutes > 0 ? formatMinutes(session.avgDurationMinutes) : "—"}
                </span>
                <span className="admin-stat-label">
                  Avg / User
                  <span className="admin-stat-help" data-tooltip="Average total time each participant spent across all their visits">?</span>
                </span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-value">
                  {session.avgVisitMinutes > 0 ? formatMinutes(session.avgVisitMinutes) : "—"}
                </span>
                <span className="admin-stat-label">
                  Avg Session
                  <span className="admin-stat-help" data-tooltip="Average duration per individual visit (a single continuous use of the session)">?</span>
                </span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-value">
                  {session.totalMinutes > 0 ? formatMinutes(session.totalMinutes) : "—"}
                </span>
                <span className="admin-stat-label">
                  Total Time
                  <span className="admin-stat-help" data-tooltip="Combined total time across all participants">?</span>
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span className="admin-detail-label">Date</span>
                <span className="admin-detail-value">{session.eventDate}</span>
              </div>
              {session.eventTime && (
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Time</span>
                  <span className="admin-detail-value">{session.eventTime}</span>
                </div>
              )}
              {session.venue?.organization && (
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Organization</span>
                  <span className="admin-detail-value">{session.venue.organization}</span>
                </div>
              )}
              {session.venue?.location && (
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Location</span>
                  <span className="admin-detail-value">{session.venue.location}</span>
                </div>
              )}
            </div>

            {/* Hosts */}
            {session.hosts?.length > 0 && (
              <div className="admin-form-section">
                <h3 className="admin-section-title">Hosts</h3>
                <div>
                  {session.hosts.map((h, i) => (
                    <span key={i} className="admin-host-tag">
                      {h.firstName} {h.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
