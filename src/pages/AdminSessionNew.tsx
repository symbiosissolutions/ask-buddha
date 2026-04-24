import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminCreateSession } from "../api/client";
import "./admin.css";

interface Host {
  firstName: string;
  lastName: string;
}

export default function AdminSessionNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [expectedParticipants, setExpectedParticipants] = useState("");
  const [hosts, setHosts] = useState<Host[]>([{ firstName: "", lastName: "" }]);
  const [org, setOrg] = useState("");
  const [location, setLocation] = useState("");

  const addHost = () => setHosts([...hosts, { firstName: "", lastName: "" }]);

  const removeHost = (i: number) =>
    setHosts(hosts.filter((_, idx) => idx !== i));

  const updateHost = (i: number, field: keyof Host, value: string) =>
    setHosts(hosts.map((h, idx) => (idx === i ? { ...h, [field]: value } : h)));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!eventDate) {
      setError("Event date is required.");
      return;
    }
    if (hosts.some((h) => !h.firstName.trim() || !h.lastName.trim())) {
      setError("All host names are required.");
      return;
    }

    setLoading(true);
    try {
      const { sessionKey } = await adminCreateSession({
        eventDate,
        eventTime,
        expectedParticipants: parseInt(expectedParticipants) || 0,
        hosts,
        venue: { organization: org, location },
      });
      navigate(`/admin/sessions/${sessionKey}`);
    } catch {
      setError("Failed to create session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-screen admin-screen-scroll">
      <div className="admin-card admin-card-wide">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-title">New Session</h1>
            <p className="admin-subtitle">Fill in the event details</p>
          </div>
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/sessions")}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Event Details */}
          <div className="admin-form-section">
            <h3 className="admin-section-title">Event Details</h3>
            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label">Date *</label>
                <input
                  className="admin-input"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Time</label>
                <input
                  className="admin-input"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Expected Participants</label>
                <input
                  className="admin-input"
                  type="number"
                  min="1"
                  value={expectedParticipants}
                  onChange={(e) => setExpectedParticipants(e.target.value)}
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          {/* Hosts */}
          <div className="admin-form-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Hosts</h3>
              <button type="button" className="admin-btn-ghost" onClick={addHost}>
                + Add Host
              </button>
            </div>
            {hosts.map((host, i) => (
              <div key={i} className="admin-host-row">
                <div className="admin-field">
                  <label className="admin-label">First Name *</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={host.firstName}
                    onChange={(e) => updateHost(i, "firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Last Name *</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={host.lastName}
                    onChange={(e) => updateHost(i, "lastName", e.target.value)}
                    required
                  />
                </div>
                {hosts.length > 1 && (
                  <button
                    type="button"
                    className="admin-btn-remove"
                    onClick={() => removeHost(i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Venue */}
          <div className="admin-form-section">
            <h3 className="admin-section-title">Venue</h3>
            <div className="admin-field">
              <label className="admin-label">Organization</label>
              <input
                className="admin-input"
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="e.g. Community Center"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Location</label>
              <input
                className="admin-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 123 Main St, City"
              />
            </div>
          </div>

          {error && <p className="admin-error">{error}</p>}
          <button className="admin-btn admin-btn-full" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
