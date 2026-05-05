import { useState, FormEvent } from "react";
import { validateKey, startUserSession } from "../api/client";
import { grantAccess } from "../hooks/useAccessGuard";
import "./KeyEntry.css";
import logo from "../assets/logo.png";

interface KeyEntryProps {
  onSuccess: () => void;
}

export default function KeyEntry({ onSuccess }: KeyEntryProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = key.trim().toUpperCase();
    if (trimmed.length !== 8) {
      setError("Please enter a valid 8-character event code.");
      return;
    }

    setLoading(true);
    try {
      const { valid, error: apiError, sessionKey } = await validateKey(trimmed);
      if (!valid) {
        setError(apiError || "Invalid code. Please check and try again.");
        return;
      }
      const { userSessionId } = await startUserSession(sessionKey);
      grantAccess(sessionKey, userSessionId);
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="key-entry-screen">
      <div className="key-entry-card">
        <div className="key-entry-logo">
          <img src={logo} alt="Ask Buddha" />
        </div>
        <h1 className="key-entry-title">Ask Buddha</h1>
        <p className="key-entry-subtitle">Enter your event code to begin</p>

        <form onSubmit={handleSubmit} className="key-entry-form">
          <input
            className="key-entry-input"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            placeholder="XXXXXXXX"
            maxLength={8}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p className="key-entry-error">{error}</p>}
          <button
            className="key-entry-btn"
            type="submit"
            disabled={loading || key.trim().length !== 8}
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
