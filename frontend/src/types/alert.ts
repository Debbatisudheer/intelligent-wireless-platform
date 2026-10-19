export interface Alert {
  id: number;
  alert_rule_id?: number | null;
  site_id?: number | null;
  access_point_id?: number | null;
  radio_id?: number | null;

  name?: string | null;
  message?: string | null;

  severity: string;
  status: string;

  metric?: string | null;
  value?: number | null;
  threshold?: number | null;

  created_at?: string;
  updated_at?: string;
}

export interface AlertResponse {
  data: Alert[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}