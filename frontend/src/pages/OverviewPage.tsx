import { useEffect, useState } from "react";

import { api } from "../services/api";
import {
  subscribeToTelemetry,
  unsubscribeFromTelemetry,
} from "../services/telemetrySocket";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import SummaryCard from "../components/SummaryCard";
import Panel from "../components/Panel";

import SiteOverview from "../components/overview/SiteOverview";
import AccessPointHealth from "../components/overview/AccessPointHealth";
import RadioHealth from "../components/overview/RadioHealth";
import ClientConnectivity from "../components/overview/ClientConnectivity";
import NetworkHealthSummary from "../components/overview/NetworkHealthSummary";
import NetworkStatusVisualization from "../components/overview/NetworkStatusVisualization";

interface Site {
  id: number;
  name: string;
}

interface AccessPoint {
  id: number;
  name: string;
  mac_address: string;
  ip_address: string;
  status: string;
}

interface Radio {
  id: number;
  access_point_id: number;
  band: string;
  channel: number;
  status: string;
}

interface Client {
  id: number;
  site_id: number;
  status?: string;
  mac_address?: string;
  hostname?: string;
  ip_address?: string;
  name?: string;
}

interface TelemetryData {
  id?: number;
  radio_id: number;
  rssi: number;
  snr: number;
  noise_floor?: number;
  channel_utilization: number;
  packet_loss: number;
  latency: number;
  connected_clients?: number;
  traffic_mbps?: number;
  created_at?: string;
}

interface ApiListResponse<T> {
  data: T[];
  meta?: Record<string, unknown>;
}

type NetworkHealth =
  | "Healthy"
  | "Attention"
  | "Critical"
  | "Waiting";

function calculateNetworkHealth(
  telemetry: TelemetryData[],
): NetworkHealth {
  if (telemetry.length === 0) {
    return "Waiting";
  }

  const averageUtilization =
    telemetry.reduce(
      (sum, item) => sum + item.channel_utilization,
      0,
    ) / telemetry.length;

  const averagePacketLoss =
    telemetry.reduce(
      (sum, item) => sum + item.packet_loss,
      0,
    ) / telemetry.length;

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

function getLatestTelemetry(
  telemetry: TelemetryData[],
): TelemetryData | null {
  if (telemetry.length === 0) {
    return null;
  }

  return telemetry.reduce((latest, current) => {
    if (!latest.created_at) {
      return current;
    }

    if (!current.created_at) {
      return latest;
    }

    return new Date(current.created_at) >
      new Date(latest.created_at)
      ? current
      : latest;
  });
}

export default function OverviewPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [accessPoints, setAccessPoints] = useState<
    AccessPoint[]
  >([]);
  const [radios, setRadios] = useState<Radio[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [telemetry, setTelemetry] = useState<
    TelemetryData[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setError(null);

    if (!loading) {
      setRetrying(true);
    }

    try {
      const [
        sitesResponse,
        accessPointsResponse,
        radiosResponse,
        clientsResponse,
        telemetryResponse,
      ] = await Promise.all([
        api.getSites() as Promise<ApiListResponse<Site>>,
        api.getAccessPoints() as Promise<
          ApiListResponse<AccessPoint>
        >,
        api.getRadios() as Promise<
          ApiListResponse<Radio>
        >,
        api.getClients() as Promise<
          ApiListResponse<Client>
        >,
        api.getTelemetry() as Promise<
          ApiListResponse<TelemetryData>
        >,
      ]);

      setSites(sitesResponse.data ?? []);
      setAccessPoints(
        accessPointsResponse.data ?? [],
      );
      setRadios(radiosResponse.data ?? []);
      setClients(clientsResponse.data ?? []);
      setTelemetry(
        telemetryResponse.data ?? [],
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "An unexpected error occurred while loading the network overview.",
      );
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void loadDashboard();

    const subscription = subscribeToTelemetry(
      (data) => {
        const incomingTelemetry =
          data as TelemetryData;

        setTelemetry((currentTelemetry) => {
          const existingIndex =
            currentTelemetry.findIndex(
              (item) =>
                item.id !== undefined &&
                incomingTelemetry.id !== undefined &&
                item.id === incomingTelemetry.id,
            );

          if (existingIndex >= 0) {
            const updatedTelemetry = [
              ...currentTelemetry,
            ];

            updatedTelemetry[existingIndex] =
              incomingTelemetry;

            return updatedTelemetry;
          }

          return [
            ...currentTelemetry,
            incomingTelemetry,
          ].slice(-100);
        });
      },
    );

    return () => {
      subscription?.unsubscribe();
      unsubscribeFromTelemetry();
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <span className="eyebrow">
              NETWORK OPERATIONS
            </span>

            <h2>Wireless Network Overview</h2>

            <p>
              Monitor the current state of the
              wireless environment.
            </p>
          </div>
        </div>

        <LoadingState
          title="Loading network overview"
          message="Retrieving sites, access points, radios, clients, and telemetry."
        />
      </div>
    );
  }

  const site = sites[0] ?? null;

  const onlineAccessPoints =
    accessPoints.filter(
      (accessPoint) =>
        accessPoint.status.toLowerCase() ===
        "online",
    ).length;

  const offlineAccessPoints =
    accessPoints.length - onlineAccessPoints;

  const onlineRadios = radios.filter(
    (radio) =>
      radio.status.toLowerCase() === "online",
  ).length;

  const offlineRadios =
    radios.length - onlineRadios;

  const connectedClients = clients.filter(
    (client) => {
      if (!client.status) {
        return true;
      }

      const status =
        client.status.toLowerCase();

      return (
        status === "connected" ||
        status === "online"
      );
    },
  ).length;

  const networkHealth =
    calculateNetworkHealth(telemetry);

  const latestTelemetry =
    getLatestTelemetry(telemetry);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            NETWORK OPERATIONS
          </span>

          <h2>Wireless Network Overview</h2>

          <p>
            Monitor the current state of the
            wireless environment.
          </p>
        </div>

        <div className="page-header-status">
          <span
            className={`status-dot ${
              error ? "" : "online"
            }`}
          />

          <span>
            {error
              ? "API connection issue"
              : "Realtime monitoring"}
          </span>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Unable to load network overview"
          message={error}
          onRetry={loadDashboard}
          retrying={retrying}
        />
      )}

      <section className="summary-grid">
        <SummaryCard
          label="SITES"
          value={String(sites.length)}
          meta={
            sites.length === 0
              ? "No sites configured"
              : "Configured network sites"
          }
        />

        <SummaryCard
          label="ACCESS POINTS"
          value={String(accessPoints.length)}
          meta={
            accessPoints.length === 0
              ? "No access points"
              : `${onlineAccessPoints} online · ${offlineAccessPoints} offline`
          }
        />

        <SummaryCard
          label="RADIOS"
          value={String(radios.length)}
          meta={
            radios.length === 0
              ? "No radios"
              : `${onlineRadios} online · ${offlineRadios} offline`
          }
        />

        <SummaryCard
          label="CONNECTED CLIENTS"
          value={String(connectedClients)}
          meta={
            clients.length === 0
              ? "No clients reported"
              : "Current client connectivity"
          }
        />

        <SummaryCard
          label="NETWORK HEALTH"
          value={networkHealth}
          meta={
            networkHealth === "Waiting"
              ? "Waiting for telemetry"
              : "Current network state"
          }
          valueClassName={
            networkHealth === "Critical"
              ? "value-critical"
              : networkHealth === "Attention"
                ? "value-warning"
                : networkHealth === "Healthy"
                  ? "value-healthy"
                  : ""
          }
        />
      </section>

      <SiteOverview
        site={site}
        accessPoints={accessPoints.length}
        radios={radios.length}
        onlineAccessPoints={
          onlineAccessPoints
        }
        onlineRadios={onlineRadios}
        networkHealth={networkHealth}
      />

      <AccessPointHealth
        accessPoints={accessPoints}
        radios={radios}
        telemetry={telemetry}
      />

      <RadioHealth
        radios={radios}
        accessPoints={accessPoints}
        telemetry={telemetry}
      />

      <ClientConnectivity
        clients={clients}
        sites={sites}
      />

      <NetworkHealthSummary
        telemetry={telemetry}
      />

      <NetworkStatusVisualization
        site={site}
        accessPoints={accessPoints}
        radios={radios}
      />

      <div className="content-grid">
        <Panel
          eyebrow="WIRELESS HEALTH"
          title="Network Metrics"
        >
          {telemetry.length === 0 ? (
            <div className="empty-state">
              <strong>
                No telemetry available
              </strong>

              <span>
                Network health metrics will appear
                when telemetry data is received.
              </span>
            </div>
          ) : (
            <div className="metric-grid">
              <div className="metric-card">
                <span className="metric-label">
                  Latest RSSI
                </span>

                <strong>
                  {latestTelemetry
                    ? `${latestTelemetry.rssi.toFixed(1)} dBm`
                    : "—"}
                </strong>

                <span className="metric-description">
                  Received signal strength
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">
                  Latest SNR
                </span>

                <strong>
                  {latestTelemetry
                    ? `${latestTelemetry.snr.toFixed(1)} dB`
                    : "—"}
                </strong>

                <span className="metric-description">
                  Signal-to-noise ratio
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">
                  Channel Utilization
                </span>

                <strong>
                  {latestTelemetry
                    ? `${latestTelemetry.channel_utilization.toFixed(1)}%`
                    : "—"}
                </strong>

                <span className="metric-description">
                  Current channel load
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">
                  Packet Loss
                </span>

                <strong>
                  {latestTelemetry
                    ? `${latestTelemetry.packet_loss.toFixed(2)}%`
                    : "—"}
                </strong>

                <span className="metric-description">
                  Current packet loss
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">
                  Latency
                </span>

                <strong>
                  {latestTelemetry
                    ? `${latestTelemetry.latency.toFixed(1)} ms`
                    : "—"}
                </strong>

                <span className="metric-description">
                  Latest network latency
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">
                  Telemetry Records
                </span>

                <strong>
                  {telemetry.length}
                </strong>

                <span className="metric-description">
                  Records currently loaded
                </span>
              </div>
            </div>
          )}
        </Panel>

        <Panel
          eyebrow="RADIO STATUS"
          title="Active Radio"
        >
          {radios.length === 0 ? (
            <div className="empty-state">
              <strong>
                No radios available
              </strong>

              <span>
                Radio information will appear when
                radios are returned by the API.
              </span>
            </div>
          ) : (
            <div className="active-radio">
              {radios
                .filter(
                  (radio) =>
                    radio.status.toLowerCase() ===
                    "online",
                )
                .slice(0, 1)
                .map((radio) => {
                  const accessPoint =
                    accessPoints.find(
                      (item) =>
                        item.id ===
                        radio.access_point_id,
                    );

                  return (
                    <div
                      className="active-radio-card"
                      key={radio.id}
                    >
                      <div className="active-radio-header">
                        <div>
                          <span className="eyebrow">
                            ACTIVE RADIO
                          </span>

                          <strong>
                            {radio.band}
                          </strong>
                        </div>

                        <span className="status-dot online" />
                      </div>

                      <div className="active-radio-details">
                        <div>
                          <span>
                            Access Point
                          </span>

                          <strong>
                            {accessPoint?.name ??
                              "Unknown"}
                          </strong>
                        </div>

                        <div>
                          <span>Channel</span>

                          <strong>
                            {radio.channel}
                          </strong>
                        </div>

                        <div>
                          <span>Status</span>

                          <strong>
                            {radio.status}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {radios.filter(
                (radio) =>
                  radio.status.toLowerCase() ===
                  "online",
              ).length === 0 && (
                <div className="empty-state">
                  <strong>
                    No active radios
                  </strong>

                  <span>
                    No radio is currently reporting
                    an online state.
                  </span>
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>

      {/* =====================================================
          REALTIME TELEMETRY
          ===================================================== */}

      <Panel
        eyebrow="REALTIME TELEMETRY"
        title="Live Telemetry Stream"
        rightContent={
          <div className="telemetry-live-status">
            <span className="telemetry-live-dot" />
            <span>LIVE</span>
          </div>
        }
      >
        {telemetry.length === 0 ? (
          <div className="telemetry-empty">
            <div className="telemetry-empty-icon">
              <span />
            </div>

            <strong>
              Waiting for telemetry
            </strong>

            <span>
              Live wireless telemetry will appear
              here when the network begins reporting
              data.
            </span>
          </div>
        ) : (
          <div className="realtime-telemetry">
            {latestTelemetry && (
              <div className="telemetry-current">
                <div className="telemetry-current-header">
                  <div>
                    <span className="telemetry-section-label">
                      CURRENT RADIO
                    </span>

                    <strong>
                      Radio #
                      {latestTelemetry.radio_id}
                    </strong>
                  </div>

                  <span className="telemetry-stream-state">
                    STREAMING
                  </span>
                </div>

                <div className="telemetry-primary-grid">
                  <div className="telemetry-primary-card">
                    <span>RSSI</span>

                    <strong>
                      {latestTelemetry.rssi.toFixed(1)}
                    </strong>

                    <small>dBm</small>
                  </div>

                  <div className="telemetry-primary-card">
                    <span>SNR</span>

                    <strong>
                      {latestTelemetry.snr.toFixed(1)}
                    </strong>

                    <small>dB</small>
                  </div>

                  <div className="telemetry-primary-card">
                    <span>
                      CHANNEL UTILIZATION
                    </span>

                    <strong>
                      {latestTelemetry.channel_utilization.toFixed(
                        1,
                      )}
                    </strong>

                    <small>%</small>
                  </div>

                  <div className="telemetry-primary-card">
                    <span>PACKET LOSS</span>

                    <strong>
                      {latestTelemetry.packet_loss.toFixed(
                        2,
                      )}
                    </strong>

                    <small>%</small>
                  </div>
                </div>

                <div className="telemetry-secondary-grid">
                  <div className="telemetry-secondary-card">
                    <span>LATENCY</span>

                    <strong>
                      {latestTelemetry.latency.toFixed(
                        1,
                      )}{" "}
                      ms
                    </strong>
                  </div>

                  <div className="telemetry-secondary-card">
                    <span>
                      CONNECTED CLIENTS
                    </span>

                    <strong>
                      {latestTelemetry.connected_clients ??
                        "—"}
                    </strong>
                  </div>

                  <div className="telemetry-secondary-card">
                    <span>TRAFFIC</span>

                    <strong>
                      {latestTelemetry.traffic_mbps !==
                      undefined
                        ? `${latestTelemetry.traffic_mbps.toFixed(
                            1,
                          )} Mbps`
                        : "—"}
                    </strong>
                  </div>

                  <div className="telemetry-secondary-card">
                    <span>NOISE FLOOR</span>

                    <strong>
                      {latestTelemetry.noise_floor !==
                      undefined
                        ? `${latestTelemetry.noise_floor.toFixed(
                            1,
                          )} dBm`
                        : "—"}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="telemetry-history">
              <div className="telemetry-history-header">
                <div>
                  <span className="telemetry-section-label">
                    TELEMETRY FEED
                  </span>

                  <strong>
                    Latest Events
                  </strong>
                </div>

                <span className="telemetry-record-count">
                  {telemetry.length} records
                </span>
              </div>

              <div className="telemetry-table">
                <div className="telemetry-table-header">
                  <span>RADIO</span>
                  <span>RSSI</span>
                  <span>SNR</span>
                  <span>UTILIZATION</span>
                  <span>LOSS</span>
                  <span>LATENCY</span>
                  <span>CLIENTS</span>
                  <span>TRAFFIC</span>
                </div>

                {telemetry
                  .slice(-8)
                  .reverse()
                  .map((item, index) => (
                    <div
                      className="telemetry-table-row"
                      key={
                        item.id ??
                        `${item.radio_id}-${index}`
                      }
                    >
                      <div className="telemetry-radio-cell">
                        <span className="telemetry-row-dot" />

                        <strong>
                          Radio #{item.radio_id}
                        </strong>
                      </div>

                      <span>
                        {item.rssi.toFixed(1)} dBm
                      </span>

                      <span>
                        {item.snr.toFixed(1)} dB
                      </span>

                      <span>
                        {item.channel_utilization.toFixed(
                          1,
                        )}
                        %
                      </span>

                      <span>
                        {item.packet_loss.toFixed(
                          2,
                        )}
                        %
                      </span>

                      <span>
                        {item.latency.toFixed(1)} ms
                      </span>

                      <span>
                        {item.connected_clients ??
                          "—"}
                      </span>

                      <span>
                        {item.traffic_mbps !==
                        undefined
                          ? `${item.traffic_mbps.toFixed(
                              1,
                            )} Mbps`
                          : "—"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}