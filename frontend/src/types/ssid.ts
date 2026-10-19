export interface Ssid {
  id: number;
  site_id: number;
  name: string;
  security_type: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface SsidResponse {
  data: Ssid[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}