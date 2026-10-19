export interface Client {
  id: number;
  site_id: number;
  ssid_id?: number | null;
  access_point_id?: number | null;
  radio_id?: number | null;
  name?: string | null;
  hostname?: string | null;
  mac_address: string;
  ip_address?: string | null;
  status: string;
  rssi?: number | null;
  snr?: number | null;
  connected_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientResponse {
  data: Client[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}