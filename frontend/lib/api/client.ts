import { GeneratedApiClient } from "@flavor/contracts/api";

import { getAccessToken } from "@/lib/auth/token-storage";

const defaultBaseUrl = "http://localhost:8000";

export class ApiClient extends GeneratedApiClient {
  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL ?? defaultBaseUrl) {
    super(baseUrl, getAccessToken);
  }
}

export const apiClient = new ApiClient();
