const ACCESS_KEY = "ask-buddha-access";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

interface AccessData {
  validatedAt: number;
  sessionKey: string;
  userSessionId: string;
}

export function checkAccess(): boolean {
  try {
    const stored = localStorage.getItem(ACCESS_KEY);
    if (!stored) return false;
    const data: AccessData = JSON.parse(stored);
    return Date.now() - data.validatedAt <= TWENTY_FOUR_HOURS;
  } catch {
    return false;
  }
}

export function getAccessData(): AccessData | null {
  try {
    const stored = localStorage.getItem(ACCESS_KEY);
    if (!stored) return null;
    const data: AccessData = JSON.parse(stored);
    if (Date.now() - data.validatedAt > TWENTY_FOUR_HOURS) {
      localStorage.removeItem(ACCESS_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function grantAccess(sessionKey: string, userSessionId: string): void {
  localStorage.setItem(
    ACCESS_KEY,
    JSON.stringify({ validatedAt: Date.now(), sessionKey, userSessionId })
  );
}
