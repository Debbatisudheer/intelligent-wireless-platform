import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

import { api } from "../../services/api";

import type {
  AccessPoint,
} from "../../types/accessPoint";

import type {
  Client,
} from "../../types/client";

interface Radio {
  id: number;
  access_point_id: number;
  band: string;
  channel: number;
  status: string;
}

interface RealtimeNetworkSummaryProps {
  updateSignal: number;
}

export default function RealtimeNetworkSummary({
  updateSignal,
}: RealtimeNetworkSummaryProps) {
  const [accessPoints, setAccessPoints] =
    useState<AccessPoint[]>([]);

  const [radios, setRadios] =
    useState<Radio[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadNetworkState =
    useCallback(
      async () => {
        try {
          setError(null);

          const [
            accessPointResponse,
            radioResponse,
            clientResponse,
          ] = await Promise.all([
            api.getAccessPoints(),
            api.getRadios(),
            api.getClients(),
          ]);

          setAccessPoints(
            (
              accessPointResponse as {
                data?: AccessPoint[];
              }
            ).data ?? [],
          );

          setRadios(
            (
              radioResponse as {
                data?: Radio[];
              }
            ).data ?? [],
          );

          setClients(
            (
              clientResponse as {
                data?: Client[];
              }
            ).data ?? [],
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to refresh network state.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadNetworkState();
  }, [
    loadNetworkState,
  ]);

  useEffect(() => {
    if (updateSignal === 0) {
      return;
    }

    void loadNetworkState();
  }, [
    updateSignal,
    loadNetworkState,
  ]);

  const onlineAccessPoints =
    accessPoints.filter(
      (accessPoint) =>
        accessPoint.status
          .toLowerCase() ===
        "online",
    ).length;

  const offlineAccessPoints =
    accessPoints.length -
    onlineAccessPoints;

  const onlineRadios =
    radios.filter(
      (radio) =>
        radio.status
          .toLowerCase() ===
        "online",
    ).length;

  return (
    <Panel
      eyebrow="LIVE NETWORK STATE"
      title="Wireless Infrastructure"
      rightContent={
        <StatusBadge
          status="Streaming"
          online
        />
      }
    >
      {loading ? (
        <div className="empty-state">
          <strong>
            Synchronizing network state
          </strong>

          <span>
            Loading access points, radios
            and connected clients.
          </span>
        </div>
      ) : error ? (
        <div className="api-error-banner">
          <div>
            <strong>
              Network state refresh failed
            </strong>

            <span>
              {error}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadNetworkState()
            }
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="summary-grid">
            <div className="metric-card">
              <span className="metric-label">
                ACCESS POINTS
              </span>

              <strong>
                {accessPoints.length}
              </strong>

              <span className="metric-description">
                {onlineAccessPoints} online ·{" "}
                {offlineAccessPoints} offline
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                RADIOS
              </span>

              <strong>
                {radios.length}
              </strong>

              <span className="metric-description">
                {onlineRadios} online
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                CLIENTS
              </span>

              <strong>
                {clients.length}
              </strong>

              <span className="metric-description">
                Current client records
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "22px",
              display: "flex",
              flexDirection:
                "column",
              gap: "10px",
            }}
          >
            {accessPoints
              .slice(0, 10)
              .map(
                (
                  accessPoint,
                ) => (
                  <div
                    key={
                      accessPoint.id
                    }
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: "16px",
                      padding:
                        "12px 0",
                      borderBottom:
                        "1px solid var(--border-color, #263142)",
                    }}
                  >
                    <div>
                      <strong>
                        {
                          accessPoint.name
                        }
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "4px",
                          fontSize:
                            "12px",
                          color:
                            "var(--muted-text, #8c98aa)",
                        }}
                      >
                        {
                          accessPoint.ip_address
                        }
                      </div>
                    </div>

                    <StatusBadge
                      status={
                        accessPoint.status
                      }
                      online={
                        accessPoint.status.toLowerCase() ===
                        "online"
                      }
                    />
                  </div>
                ),
              )}
          </div>
        </>
      )}
    </Panel>
  );
}