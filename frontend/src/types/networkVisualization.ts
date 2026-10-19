export type NetworkNodeType =
  | "site"
  | "access-point"
  | "radio"
  | "client";

export interface VisualizationSite {
  id: number;
  name: string;
}

export interface VisualizationAccessPoint {
  id: number;
  site_id: number;
  name: string;
  mac_address: string;
  ip_address: string;
  status: string;
}

export interface VisualizationRadio {
  id: number;
  access_point_id: number;
  band: string;
  channel: number;
  status: string;
}

export interface VisualizationClient {
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
}

export interface NetworkVisualizationData {
  sites: VisualizationSite[];
  accessPoints: VisualizationAccessPoint[];
  radios: VisualizationRadio[];
  clients: VisualizationClient[];
}

export interface NetworkNodeSelection {
  type: NetworkNodeType;
  id: number;
}