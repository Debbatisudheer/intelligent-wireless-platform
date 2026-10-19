const API_BASE_URL = "http://localhost:3000/api/v1";

interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

async function apiRequest<T>(
  endpoint: string,
): Promise<ApiResponse<T>> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<ApiResponse<T>>;
}

export const api = {
  getOrganizations: () =>
    apiRequest("/organizations"),

  getSites: () =>
    apiRequest("/sites"),

  getAccessPoints: () =>
    apiRequest("/access_points"),

  getRadios: () =>
    apiRequest("/radios"),

  getTelemetry: () =>
    apiRequest("/telemetry_records"),

  getSsids: () =>
    apiRequest("/ssids"),

  getClients: () =>
    apiRequest("/clients"),

  getAlertRules: () =>
    apiRequest("/alert_rules"),

  getAlerts: () =>
    apiRequest("/alerts"),

  getIncidents: () =>
    apiRequest("/incidents"),
};