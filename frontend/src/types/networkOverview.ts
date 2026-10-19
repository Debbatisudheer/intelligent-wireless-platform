export interface NetworkOverview {
  sites: number;
  accessPoints: number;
  radios: number;
  connectedClients: number;

  onlineAccessPoints: number;
  offlineAccessPoints: number;

  onlineRadios: number;
  offlineRadios: number;

  averageRssi: number | null;
  averageSnr: number | null;
  averageChannelUtilization: number | null;
  averagePacketLoss: number | null;
  averageLatency: number | null;

  networkHealth:
    | "Healthy"
    | "Attention"
    | "Critical"
    | "Waiting";
}