const refreshTokenKey = "flavor-odyssey.refresh-token";

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage.getItem(refreshTokenKey);
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (token) {
    window.sessionStorage.setItem(refreshTokenKey, token);
  } else {
    window.sessionStorage.removeItem(refreshTokenKey);
  }
}

export function clearAuthTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}
