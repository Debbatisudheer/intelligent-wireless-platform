import { api } from "./api";
import type { NetworkOverview } from "../types/networkOverview";

interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total?: number;
  };
}

interface Site {
  id: number;
  name: string;
}

interface AccessPoint {
  id: number;
  name: string;
  status: string;
}

interface Radio {
  id: number;
  band: string;
  channel: number;
  status: string;
}

interface TelemetryRecord {
  id: number;
  rssi: number;
  snr: number;
  channel_utilization: number;
  packet_loss: number;
  latency: number;
  connected_clients: number;
}

function average(
  values: number[],
): number | null {
  if (values.length === 0) {
    return null;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length
  );
}

function calculateHealth(
  telemetry: TelemetryRecord[],
):
  | "Healthy"
  | "Attention"
  | "Critical"
  | "Waiting" {
  if (telemetry.length === 0) {
    return "Waiting";
  }

  const averageUtilization =
    average(
      telemetry.map(
        (item) =>
          item.channel_utilization,
      ),
    ) ?? 0;

  const averagePacketLoss =
    average(
      telemetry.map(
        (item) => item.packet_loss,
      ),
    ) ?? 0;

  if (
    averageUtilization >= 85 ||
    averagePacketLoss >= 10
  ) {
    return "Critical";
  }

  if (
    averageUtilization >= 60 ||
    averagePacketLoss >= 3
  ) {
    return "Attention";
  }

  return "Healthy";
}

export async function getNetworkOverview(): Promise<NetworkOverview> {
  const [
    sitesResponse,
    accessPointsResponse,
    radiosResponse,
    telemetryResponse,
  ] = (await Promise.all([
    api.getSites(),
    api.getAccessPoints(),
    api.getRadios(),
    api.getTelemetry(),
  ])) as [
    ApiListResponse<Site>,
    ApiListResponse<AccessPoint>,
    ApiListResponse<Radio>,
    ApiListResponse<TelemetryRecord>,
  ];

  const sites = sitesResponse.data;
  const accessPoints =
    accessPointsResponse.data;
  const radios = radiosResponse.data;
  const telemetry =
    telemetryResponse.data;

  const onlineAccessPoints =
    accessPoints.filter(
      (item) =>
        item.status.toLowerCase() ===
        "online",
    ).length;

  const offlineAccessPoints =
    accessPoints.length -
    onlineAccessPoints;

  const onlineRadios =
    radios.filter(
      (item) =>
        item.status.toLowerCase() ===
        "online",
    ).length;

  const offlineRadios =
    radios.length - onlineRadios;

  return {
    sites: sitesResponse.meta?.total ?? sites.length,

    accessPoints:
      accessPointsResponse.meta?.total ??
      accessPoints.length,

    radios:
      radiosResponse.meta?.total ??
      radios.length,

    connectedClients:
      telemetry.reduce(
        (total, item) =>
          total +
          item.connected_clients,
        0,
      ),

    onlineAccessPoints,
    offlineAccessPoints,

    onlineRadios,
    offlineRadios,

    averageRssi: average(
      telemetry.map(
        (item) => item.rssi,
      ),
    ),

    averageSnr: average(
      telemetry.map(
        (item) => item.snr,
      ),
    ),

    averageChannelUtilization:
      average(
        telemetry.map(
          (item) =>
            item.channel_utilization,
        ),
      ),

    averagePacketLoss: average(
      telemetry.map(
        (item) =>
          item.packet_loss,
      ),
    ),

    averageLatency: average(
      telemetry.map(
        (item) => item.latency,
      ),
    ),

    networkHealth:
      calculateHealth(telemetry),
  };
}