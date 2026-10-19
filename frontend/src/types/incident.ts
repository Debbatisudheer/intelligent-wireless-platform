export interface Incident {
  id: number;

  site_id?: number | null;
  access_point_id?: number | null;
  radio_id?: number | null;
  alert_id?: number | null;

  name?: string | null;
  title?: string | null;
  description?: string | null;

  severity?: string | null;
  status: string;

  created_at?: string;
  updated_at?: string;
}

export interface IncidentResponse {
  data: Incident[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}