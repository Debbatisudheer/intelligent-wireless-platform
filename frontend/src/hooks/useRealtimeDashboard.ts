import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  subscribeToTelemetry,
  unsubscribeFromTelemetry,
} from "../services/telemetrySocket";

import type {
  TelemetryRecord,
} from "../types/analytics";

export type RealtimeConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface RealtimeDashboardState {
  connectionState: RealtimeConnectionState;
  latestTelemetry: TelemetryRecord | null;
  updateCount: number;
  lastUpdatedAt: string | null;
  error: string | null;
}

interface TelemetryMessage {
  id?: number;
  radio_id?: number;
  rssi?: number;
  snr?: number;
  noise_floor?: number;
  channel_utilization?: number;
  packet_loss?: number;
  latency?: number;
  connected_clients?: number;
  traffic_mbps?: number;
  created_at?: string;
}

function isValidTelemetryMessage(
  value: unknown,
): value is TelemetryMessage {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const message =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof message.id === "number" &&
    typeof message.radio_id === "number" &&
    typeof message.rssi === "number" &&
    typeof message.snr === "number" &&
    typeof message.noise_floor ===
      "number" &&
    typeof message.channel_utilization ===
      "number" &&
    typeof message.packet_loss ===
      "number" &&
    typeof message.latency ===
      "number" &&
    typeof message.connected_clients ===
      "number" &&
    typeof message.traffic_mbps ===
      "number"
  );
}

function normalizeTelemetry(
  message: TelemetryMessage,
): TelemetryRecord {
  return {
    id: message.id!,
    radio_id: message.radio_id!,
    rssi: message.rssi!,
    snr: message.snr!,
    noise_floor:
      message.noise_floor!,
    channel_utilization:
      message.channel_utilization!,
    packet_loss:
      message.packet_loss!,
    latency:
      message.latency!,
    connected_clients:
      message.connected_clients!,
    traffic_mbps:
      message.traffic_mbps!,
    created_at:
      message.created_at ??
      new Date().toISOString(),
  };
}

export function useRealtimeDashboard() {
  const [state, setState] =
    useState<RealtimeDashboardState>({
      connectionState:
        "connecting",
      latestTelemetry: null,
      updateCount: 0,
      lastUpdatedAt: null,
      error: null,
    });

  const mountedRef =
    useRef(true);

  const handleReceived =
    useCallback(
      (data: unknown) => {
        if (!mountedRef.current) {
          return;
        }

        if (
          !isValidTelemetryMessage(
            data,
          )
        ) {
          setState(
            (current) => ({
              ...current,
              error:
                "Received an invalid telemetry update.",
            }),
          );

          return;
        }

        const telemetry =
          normalizeTelemetry(
            data,
          );

        setState(
          (current) => ({
            ...current,
            connectionState:
              "connected",
            latestTelemetry:
              telemetry,
            updateCount:
              current.updateCount + 1,
            lastUpdatedAt:
              telemetry.created_at,
            error: null,
          }),
        );
      },
      [],
    );

  useEffect(() => {
    mountedRef.current = true;

    setState(
      (current) => ({
        ...current,
        connectionState:
          "connecting",
        error: null,
      }),
    );

    const subscription =
      subscribeToTelemetry(
        handleReceived,
        {
          onConnected: () => {
            if (!mountedRef.current) {
              return;
            }

            setState(
              (current) => ({
                ...current,
                connectionState:
                  "connected",
                error: null,
              }),
            );
          },

          onDisconnected: () => {
            if (!mountedRef.current) {
              return;
            }

            setState(
              (current) => ({
                ...current,
                connectionState:
                  "disconnected",
              }),
            );
          },

          onRejected: () => {
            if (!mountedRef.current) {
              return;
            }

            setState(
              (current) => ({
                ...current,
                connectionState:
                  "error",
                error:
                  "Telemetry WebSocket subscription was rejected.",
              }),
            );
          },
        },
      );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      unsubscribeFromTelemetry();
    };
  }, [handleReceived]);

  return state;
}