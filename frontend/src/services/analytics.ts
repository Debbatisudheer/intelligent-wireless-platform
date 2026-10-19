import { api } from "./api";

import type {
  AnalyticsDataset,
  ChannelUtilizationAnalytics,
  LatencyAnalytics,
  PacketLossAnalytics,
  SignalAnalyticsData,
  SnrAnalyticsData,
  TelemetryRecord,
  TrafficAnalytics,
} from "../types/analytics";

function calculateAverage(
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

function getValidRecords(
  records: TelemetryRecord[],
  selector: (
    record: TelemetryRecord,
  ) => number,
): TelemetryRecord[] {
  return records.filter((record) => {
    const value = selector(record);

    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  });
}

function buildSignalAnalytics(
  records: TelemetryRecord[],
): SignalAnalyticsData {
  const validRecords =
    getValidRecords(
      records,
      (record) => record.rssi,
    );

  if (validRecords.length === 0) {
    return {
      currentRssi: null,
      averageRssi: null,
      strongestRssi: null,
      weakestRssi: null,
      radioId: null,
      history: [],
    };
  }

  const sorted = [
    ...validRecords,
  ].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime(),
  );

  const values = sorted.map(
    (record) => record.rssi,
  );

  const latest =
    sorted[sorted.length - 1];

  return {
    currentRssi: latest.rssi,
    averageRssi:
      calculateAverage(values),
    strongestRssi: Math.max(...values),
    weakestRssi: Math.min(...values),
    radioId: latest.radio_id,
    history: sorted.map(
      (record) => ({
        id: record.id,
        radioId: record.radio_id,
        rssi: record.rssi,
        createdAt: record.created_at,
      }),
    ),
  };
}

function buildSnrAnalytics(
  records: TelemetryRecord[],
): SnrAnalyticsData {
  const validRecords =
    getValidRecords(
      records,
      (record) => record.snr,
    );

  if (validRecords.length === 0) {
    return {
      currentSnr: null,
      averageSnr: null,
      strongestSnr: null,
      weakestSnr: null,
      radioId: null,
      history: [],
    };
  }

  const sorted = [
    ...validRecords,
  ].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime(),
  );

  const values = sorted.map(
    (record) => record.snr,
  );

  const latest =
    sorted[sorted.length - 1];

  return {
    currentSnr: latest.snr,
    averageSnr:
      calculateAverage(values),
    strongestSnr: Math.max(...values),
    weakestSnr: Math.min(...values),
    radioId: latest.radio_id,
    history: sorted.map(
      (record) => ({
        id: record.id,
        radioId: record.radio_id,
        snr: record.snr,
        createdAt: record.created_at,
      }),
    ),
  };
}

function buildMetricAnalytics(
  records: TelemetryRecord[],
  selector: (
    record: TelemetryRecord,
  ) => number,
) {
  const validRecords =
    getValidRecords(
      records,
      selector,
    );

  if (validRecords.length === 0) {
    return {
      current: null,
      average: null,
      highest: null,
      lowest: null,
    };
  }

  const sorted = [
    ...validRecords,
  ].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime(),
  );

  const values = sorted.map(selector);

  return {
    current:
      selector(
        sorted[sorted.length - 1],
      ),
    average:
      calculateAverage(values),
    highest: Math.max(...values),
    lowest: Math.min(...values),
  };
}

export async function getSignalAnalytics(): Promise<SignalAnalyticsData> {
  const response =
    await api.getTelemetry();

  const payload =
    response as {
      data?: TelemetryRecord[];
    };

  return buildSignalAnalytics(
    payload.data ?? [],
  );
}

export async function getSnrAnalytics(): Promise<SnrAnalyticsData> {
  const response =
    await api.getTelemetry();

  const payload =
    response as {
      data?: TelemetryRecord[];
    };

  return buildSnrAnalytics(
    payload.data ?? [],
  );
}

export async function getAnalyticsDataset(): Promise<AnalyticsDataset> {
  const response =
    await api.getTelemetry();

  const payload =
    response as {
      data?: TelemetryRecord[];
    };

  const records =
    payload.data ?? [];

  return {
    records,

    channelUtilization:
      buildMetricAnalytics(
        records,
        (record) =>
          record.channel_utilization,
      ) as ChannelUtilizationAnalytics,

    packetLoss:
      buildMetricAnalytics(
        records,
        (record) =>
          record.packet_loss,
      ) as PacketLossAnalytics,

    latency:
      buildMetricAnalytics(
        records,
        (record) =>
          record.latency,
      ) as LatencyAnalytics,

    traffic:
      buildMetricAnalytics(
        records,
        (record) =>
          record.traffic_mbps,
      ) as TrafficAnalytics,
  };
}