export interface AccessPoint {
  id: number;
  site_id: number;
  name: string;
  mac_address: string;
  ip_address: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface AccessPointResponse {
  data: AccessPoint[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}