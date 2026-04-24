const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function getAdminToken(): string {
  return sessionStorage.getItem("ask-buddha-admin-token") ?? "";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

// Admin — auth
export function adminLogin(username: string, password: string) {
  return apiFetch<{ token: string }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// Admin — sessions
export function adminCreateSession(payload: {
  eventDate: string;
  eventTime: string;
  expectedParticipants: number;
  hosts: { firstName: string; lastName: string }[];
  venue: { organization: string; location: string };
}) {
  return apiFetch<{ sessionKey: string }>("/admin/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(payload),
  });
}

export function adminListSessions() {
  return apiFetch<{ sessions: Session[] }>("/admin/sessions", {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
}

export function adminGetSession(key: string) {
  return apiFetch<{ session: any }>(`/admin/sessions/${key}`, {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
}

// Public — key validation
export function validateKey(key: string) {
  return apiFetch<{ valid: boolean; error?: string; sessionKey: string }>("/validate-key", {
    method: "POST",
    body: JSON.stringify({ key }),
  });
}

// Public — user session tracking (participant count, created once per device)
export function startUserSession(sessionKey: string) {
  return apiFetch<{ userSessionId: string }>("/user-sessions", {
    method: "POST",
    body: JSON.stringify({ sessionKey }),
  });
}

// Public — visit tracking (created each time user opens the chat)
export function startVisit(userSessionId: string, sessionKey: string) {
  return apiFetch<{ visitId: string }>("/visits", {
    method: "POST",
    body: JSON.stringify({ userSessionId, sessionKey }),
  });
}

export function endVisit(visitId: string): void {
  fetch(`${BASE_URL}/visits/${visitId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}

// Shared types
export interface Session {
  sessionKey: string;
  eventDate: string;
  eventTime: string;
  expectedParticipants: number;
  hosts: { firstName: string; lastName: string }[];
  venue: { organization: string; location: string };
  createdAt: string;
}

