const refreshTokenKey = "flavor-odyssey.refresh-token";

let accessToken: string | null = null;

function readSessionStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionStorage(key: string, value: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (value) {
      window.sessionStorage.setItem(key, value);
    } else {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    accessToken = null;
  }
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken() {
  return readSessionStorage(refreshTokenKey);
}

export function setRefreshToken(token: string | null) {
  writeSessionStorage(refreshTokenKey, token);
}

export function clearAuthTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}
