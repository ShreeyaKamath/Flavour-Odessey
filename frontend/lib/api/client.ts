import { GeneratedApiClient } from "@flavor/contracts/api";

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken
} from "@/lib/auth/token-storage";
import { authSessionExpiredEvent } from "@/lib/auth/session-events";

const defaultBaseUrl = "http://localhost:8000";
export { authSessionExpiredEvent } from "@/lib/auth/session-events";

let refreshRequest: Promise<string | null> | null = null;

function expireSession() {
  clearAuthTokens();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(authSessionExpiredEvent));
  }
}

function refreshAccessToken(baseUrl: string) {
  if (refreshRequest) {
    return refreshRequest;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    expireSession();
    return Promise.resolve(null);
  }

  const refreshClient = new GeneratedApiClient(baseUrl, getAccessToken);
  refreshRequest = refreshClient
    .authRefresh({ refresh_token: refreshToken })
    .then((response) => {
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      return response.access_token;
    })
    .catch(() => {
      expireSession();
      return null;
    })
    .finally(() => {
      refreshRequest = null;
    });
  return refreshRequest;
}

/** Adds authentication refresh behavior to the generated API client. */
export class ApiClient extends GeneratedApiClient {
  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL ?? defaultBaseUrl) {
    super(baseUrl, getAccessToken, () => refreshAccessToken(baseUrl));
  }
}

export const apiClient = new ApiClient();
