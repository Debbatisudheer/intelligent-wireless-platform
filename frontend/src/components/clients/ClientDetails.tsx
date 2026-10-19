import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

import type { Client } from "../../types/client";

interface ClientDetailsProps {
  client: Client | null;
  onClose: () => void;
}

type ConnectivityState =
  | "Connected"
  | "Disconnected"
  | "Unknown";

function getConnectivityState(
  status: string,
): ConnectivityState {
  const normalizedStatus =
    status.trim().toLowerCase();

  if (
    normalizedStatus === "connected" ||
    normalizedStatus === "online"
  ) {
    return "Connected";
  }

  if (
    normalizedStatus === "disconnected" ||
    normalizedStatus === "offline"
  ) {
    return "Disconnected";
  }

  return "Unknown";
}

function formatValue(
  value: number | string | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  return String(value);
}

export default function ClientDetails({
  client,
  onClose,
}: ClientDetailsProps) {
  if (!client) {
    return null;
  }

  const connectivity =
    getConnectivityState(client.status);

  const isConnected =
    connectivity === "Connected";

  return (
    <div
      className="client-details-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Client details for ${
        client.name ??
        client.hostname ??
        `Client-${client.id}`
      }`}
    >
      <div className="client-details">
        <div className="client-details-header">
          <div>
            <span className="eyebrow">
              CLIENT DETAILS
            </span>

            <h2>
              {client.name ??
                client.hostname ??
                `Client-${client.id}`}
            </h2>

            <div className="client-details-status">
              <StatusBadge
                status={connectivity}
                online={isConnected}
              />
            </div>
          </div>

          <button
            type="button"
            className="management-action-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="client-live-summary">
          <div className="client-live-summary-card">
            <span>CONNECTIVITY</span>

            <strong>
              {connectivity}
            </strong>

            <small>
              Backend: {client.status || "Unknown"}
            </small>
          </div>

          <div className="client-live-summary-card">
            <span>RSSI</span>

            <strong>
              {client.rssi !== null &&
              client.rssi !== undefined
                ? `${client.rssi} dBm`
                : "—"}
            </strong>

            <small>
              Received signal strength
            </small>
          </div>

          <div className="client-live-summary-card">
            <span>SNR</span>

            <strong>
              {client.snr !== null &&
              client.snr !== undefined
                ? `${client.snr} dB`
                : "—"}
            </strong>

            <small>
              Signal-to-noise ratio
            </small>
          </div>
        </div>

        <div className="client-connectivity-grid">
          <Panel
            eyebrow="CLIENT CONNECTIVITY"
            title="Connection State"
          >
            <div className="client-connectivity-card">
              <div className="client-connectivity-status">
                <span
                  className={`client-connectivity-indicator ${
                    connectivity === "Connected"
                      ? "connected"
                      : connectivity ===
                          "Disconnected"
                        ? "disconnected"
                        : "unknown"
                  }`}
                >
                  <span className="client-connectivity-dot" />
                </span>

                <div>
                  <strong>
                    {connectivity}
                  </strong>

                  <span>
                    {connectivity ===
                    "Connected"
                      ? "Client is currently connected to the wireless network."
                      : connectivity ===
                          "Disconnected"
                        ? "Client is currently disconnected from the wireless network."
                        : "The backend status is not currently classified."}
                  </span>
                </div>
              </div>

              <div className="client-connectivity-status-meta">
                <span>
                  Connected At
                </span>

                <strong>
                  {formatValue(
                    client.connected_at,
                  )}
                </strong>
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="SIGNAL TELEMETRY"
            title="Wireless Signal"
          >
            <div className="client-information-list">
              <div>
                <span>RSSI</span>

                <strong>
                  {client.rssi !== null &&
                  client.rssi !== undefined
                    ? `${client.rssi} dBm`
                    : "Not available"}
                </strong>
              </div>

              <div>
                <span>SNR</span>

                <strong>
                  {client.snr !== null &&
                  client.snr !== undefined
                    ? `${client.snr} dB`
                    : "Not available"}
                </strong>
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          eyebrow="NETWORK ASSOCIATION"
          title="Client Mapping"
        >
          <div className="client-information-list">
            <div>
              <span>Site</span>

              <strong>
                {formatValue(
                  client.site_id,
                )}
              </strong>
            </div>

            <div>
              <span>SSID</span>

              <strong>
                {formatValue(
                  client.ssid_id,
                )}
              </strong>
            </div>

            <div>
              <span>Access Point</span>

              <strong>
                {formatValue(
                  client.access_point_id,
                )}
              </strong>
            </div>

            <div>
              <span>Radio</span>

              <strong>
                {formatValue(
                  client.radio_id,
                )}
              </strong>
            </div>
          </div>
        </Panel>

        <Panel
          eyebrow="NETWORK PATH"
          title="Wireless Association"
        >
          <div className="client-network-path">
            <div className="client-network-path-item">
              <span className="client-network-path-label">
                SITE
              </span>

              <strong>
                {formatValue(
                  client.site_id,
                )}
              </strong>
            </div>

            <span className="client-network-path-arrow">
              →
            </span>

            <div className="client-network-path-item">
              <span className="client-network-path-label">
                SSID
              </span>

              <strong>
                {formatValue(
                  client.ssid_id,
                )}
              </strong>
            </div>

            <span className="client-network-path-arrow">
              →
            </span>

            <div className="client-network-path-item">
              <span className="client-network-path-label">
                ACCESS POINT
              </span>

              <strong>
                {formatValue(
                  client.access_point_id,
                )}
              </strong>
            </div>

            <span className="client-network-path-arrow">
              →
            </span>

            <div className="client-network-path-item">
              <span className="client-network-path-label">
                RADIO
              </span>

              <strong>
                {formatValue(
                  client.radio_id,
                )}
              </strong>
            </div>
          </div>
        </Panel>

        <Panel
          eyebrow="CLIENT IDENTITY"
          title="Client Information"
        >
          <div className="client-information-list">
            <div>
              <span>Name</span>

              <strong>
                {formatValue(
                  client.name,
                )}
              </strong>
            </div>

            <div>
              <span>Hostname</span>

              <strong>
                {formatValue(
                  client.hostname,
                )}
              </strong>
            </div>

            <div>
              <span>MAC Address</span>

              <strong>
                {client.mac_address}
              </strong>
            </div>

            <div>
              <span>IP Address</span>

              <strong>
                {formatValue(
                  client.ip_address,
                )}
              </strong>
            </div>

            <div>
              <span>Client ID</span>

              <strong>
                {client.id}
              </strong>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}