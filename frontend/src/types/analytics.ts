export interface TelemetryRecord {
  id: number;
  radio_id: number;
  rssi: number;
  snr: number;
  noise_floor: number;
  channel_utilization: number;
  packet_loss: number;
  latency: number;
  connected_clients: number;
  traffic_mbps: number;
  created_at: string;
  updated_at?: string;
}

export interface TelemetryResponse {
  data: TelemetryRecord[];
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface SignalAnalyticsData {
  currentRssi: number | null;
  averageRssi: number | null;
  strongestRssi: number | null;
  weakestRssi: number | null;
  radioId: number | null;
  history: Array<{
    id: number;
    radioId: number;
    rssi: number;
    createdAt: string;
  }>;
}

export interface SnrAnalyticsData {
  currentSnr: number | null;
  averageSnr: number | null;
  strongestSnr: number | null;
  weakestSnr: number | null;
  radioId: number | null;
  history: Array<{
    id: number;
    radioId: number;
    snr: number;
    createdAt: string;
  }>;
}

export interface ChannelUtilizationAnalytics {
  current: number | null;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}

export interface PacketLossAnalytics {
  current: number | null;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}

export interface LatencyAnalytics {
  current: number | null;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}

export interface TrafficAnalytics {
  current: number | null;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}

export interface AnalyticsDataset {
  records: TelemetryRecord[];

  channelUtilization: ChannelUtilizationAnalytics;
  packetLoss: PacketLossAnalytics;
  latency: LatencyAnalytics;
  traffic: TrafficAnalytics;
}