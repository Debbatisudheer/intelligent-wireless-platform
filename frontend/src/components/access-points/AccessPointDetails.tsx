import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

interface AccessPoint {
  id: number;
  site_id: number;
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

interface Telemetry {
  id: number;
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

interface AccessPointDetailsProps {
  accessPoint: AccessPoint | null;
  radios: Radio[];
  telemetry: Telemetry[];
  onClose: () => void;
}

type HealthState =
  | "Healthy"
  | "Attention"
  | "Critical"
  | "Waiting";

function getLatestTelemetry(
  radioId: number,
  telemetry: Telemetry[],
): Telemetry | null {
  const records = telemetry
    .filter((item) => item.radio_id === radioId)
    .sort((a, b) => {
      const left = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const right = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return right - left;
    });

  return records[0] ?? null;
}

function getRadioHealth(
  telemetry: Telemetry | null,
): HealthState {
  if (!telemetry) {
    return "Waiting";
  }

  if (
    telemetry.rssi < -75 ||
    telemetry.snr < 15 ||
    telemetry.channel_utilization >= 85 ||
    telemetry.packet_loss >= 10 ||
    telemetry.latency >= 100
  ) {
    return "Critical";
  }

  if (
    telemetry.rssi < -65 ||
    telemetry.snr < 25 ||
    telemetry.channel_utilization >= 60 ||
    telemetry.packet_loss >= 3 ||
    telemetry.latency >= 50
  ) {
    return "Attention";
  }

  return "Healthy";
}

function formatNumber(
  value: number | undefined,
  decimals = 1,
): string {
  if (value === undefined || value === null) {
    return "—";
  }

  return value.toFixed(decimals);
}

function formatTimestamp(
  value?: string,
): string {
  if (!value) {
    return "Waiting";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

export default function AccessPointDetails({
  accessPoint,
  radios,
  telemetry,
  onClose,
}: AccessPointDetailsProps) {
  if (!accessPoint) {
    return null;
  }

  const accessPointRadios = radios.filter(
    (radio) =>
      radio.access_point_id === accessPoint.id,
  );

  const radioTelemetry = accessPointRadios.map(
    (radio) => ({
      radio,
      latest: getLatestTelemetry(
        radio.id,
        telemetry,
      ),
    }),
  );

  const online =
    accessPoint.status.toLowerCase() ===
    "online";

  const onlineRadios =
    accessPointRadios.filter(
      (radio) =>
        radio.status.toLowerCase() ===
        "online",
    ).length;

  const totalClients =
    radioTelemetry.reduce(
      (total, item) =>
        total +
        (item.latest?.connected_clients ?? 0),
      0,
    );

  const totalTraffic =
    radioTelemetry.reduce(
      (total, item) =>
        total +
        (item.latest?.traffic_mbps ?? 0),
      0,
    );

  const healthStates =
    radioTelemetry.map((item) =>
      getRadioHealth(item.latest),
    );

  const overallHealth: HealthState =
    healthStates.includes("Critical")
      ? "Critical"
      : healthStates.includes("Attention")
        ? "Attention"
        : healthStates.includes("Healthy")
          ? "Healthy"
          : "Waiting";

  return (
    <div className="access-point-details-overlay">
      <div className="access-point-details">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="access-point-details-header">
          <div>
            <span className="eyebrow">
              ACCESS POINT
            </span>

            <h2>{accessPoint.name}</h2>

            <span className="details-subtitle">
              AP ID: {accessPoint.id}
            </span>
          </div>

          <div className="details-header-actions">
            <StatusBadge
              status={
                online
                  ? "Online"
                  : "Offline"
              }
              online={online}
            />

            <button
              type="button"
              className="details-close-button"
              onClick={onClose}
              aria-label="Close access point details"
            >
              Close
            </button>
          </div>
        </div>

        {/* =================================================
            AP IDENTITY
        ================================================== */}

        <div className="details-identity-grid">
          <div className="details-identity-card">
            <span>IP ADDRESS</span>
            <strong>
              {accessPoint.ip_address}
            </strong>
          </div>

          <div className="details-identity-card">
            <span>MAC ADDRESS</span>
            <strong>
              {accessPoint.mac_address}
            </strong>
          </div>

          <div className="details-identity-card">
            <span>SITE ID</span>
            <strong>
              {accessPoint.site_id}
            </strong>
          </div>

          <div className="details-identity-card">
            <span>RADIOS</span>
            <strong>
              {onlineRadios}/
              {accessPointRadios.length}
            </strong>
          </div>
        </div>

        {/* =================================================
            LIVE AP SUMMARY
        ================================================== */}

        <Panel
          eyebrow="LIVE STATE"
          title="Access Point Summary"
          rightContent={
            <StatusBadge
              status={overallHealth}
              online={
                overallHealth ===
                "Healthy"
              }
            />
          }
        >
          <div className="ap-live-summary">
            <div className="ap-live-summary-card">
              <span>RADIOS ONLINE</span>

              <strong>
                {onlineRadios}/
                {accessPointRadios.length}
              </strong>

              <small>
                Current radio availability
              </small>
            </div>

            <div className="ap-live-summary-card">
              <span>CONNECTED CLIENTS</span>

              <strong>
                {totalClients}
              </strong>

              <small>
                Across monitored radios
              </small>
            </div>

            <div className="ap-live-summary-card">
              <span>TRAFFIC</span>

              <strong>
                {totalTraffic.toFixed(1)}
                {" Mbps"}
              </strong>

              <small>
                Combined latest traffic
              </small>
            </div>

            <div className="ap-live-summary-card">
              <span>NETWORK HEALTH</span>

              <strong>
                {overallHealth}
              </strong>

              <small>
                Based on latest telemetry
              </small>
            </div>
          </div>
        </Panel>

        {/* =================================================
            RADIO TELEMETRY
        ================================================== */}

        <Panel
          eyebrow="WIRELESS TELEMETRY"
          title="Radio Telemetry"
        >
          {accessPointRadios.length ===
          0 ? (
            <div className="empty-state">
              <strong>
                No radios available
              </strong>

              <span>
                No radio records are
                associated with this access
                point.
              </span>
            </div>
          ) : (
            <div className="ap-radio-details-list">
              {radioTelemetry.map(
                ({
                  radio,
                  latest,
                }) => {
                  const radioOnline =
                    radio.status.toLowerCase() ===
                    "online";

                  const health =
                    getRadioHealth(
                      latest,
                    );

                  return (
                    <div
                      className="ap-radio-detail-card"
                      key={radio.id}
                    >
                      {/* -------------------------------
                          RADIO HEADER
                      -------------------------------- */}

                      <div className="ap-radio-detail-header">
                        <div className="ap-radio-detail-identity">
                          <div className="radio-detail-icon">
                            RF
                          </div>

                          <div>
                            <strong>
                              {radio.band}
                            </strong>

                            <span>
                              Radio ID:{" "}
                              {radio.id}
                            </span>
                          </div>
                        </div>

                        <div className="ap-radio-status-group">
                          <StatusBadge
                            status={
                              radioOnline
                                ? "Online"
                                : "Offline"
                            }
                            online={
                              radioOnline
                            }
                          />

                          <StatusBadge
                            status={health}
                            online={
                              health ===
                              "Healthy"
                            }
                          />
                        </div>
                      </div>

                      {/* -------------------------------
                          RADIO METADATA
                      -------------------------------- */}

                      <div className="ap-radio-detail-meta">
                        <span>
                          Channel{" "}
                          <strong>
                            {radio.channel}
                          </strong>
                        </span>

                        <span>
                          Telemetry{" "}
                          <strong>
                            {latest
                              ? "Available"
                              : "Waiting"}
                          </strong>
                        </span>

                        <span>
                          Updated{" "}
                          <strong>
                            {formatTimestamp(
                              latest?.created_at,
                            )}
                          </strong>
                        </span>
                      </div>

                      {/* -------------------------------
                          PRIMARY METRICS
                      -------------------------------- */}

                      <div className="ap-radio-primary-metrics">
                        <div>
                          <span>
                            RSSI
                          </span>

                          <strong>
                            {latest
                              ? `${formatNumber(
                                  latest.rssi,
                                )} dBm`
                              : "—"}
                          </strong>

                          <small>
                            Signal strength
                          </small>
                        </div>

                        <div>
                          <span>
                            SNR
                          </span>

                          <strong>
                            {latest
                              ? `${formatNumber(
                                  latest.snr,
                                )} dB`
                              : "—"}
                          </strong>

                          <small>
                            Signal quality
                          </small>
                        </div>

                        <div>
                          <span>
                            CHANNEL UTILIZATION
                          </span>

                          <strong>
                            {latest
                              ? `${formatNumber(
                                  latest.channel_utilization,
                                )}%`
                              : "—"}
                          </strong>

                          <small>
                            Airtime utilization
                          </small>
                        </div>

                        <div>
                          <span>
                            PACKET LOSS
                          </span>

                          <strong>
                            {latest
                              ? `${formatNumber(
                                  latest.packet_loss,
                                  2,
                                )}%`
                              : "—"}
                          </strong>

                          <small>
                            Packet delivery quality
                          </small>
                        </div>
                      </div>

                      {/* -------------------------------
                          SECONDARY METRICS
                      -------------------------------- */}

                      <div className="ap-radio-secondary-metrics">
                        <div>
                          <span>
                            NOISE FLOOR
                          </span>

                          <strong>
                            {latest?.noise_floor !==
                            undefined
                              ? `${formatNumber(
                                  latest.noise_floor,
                                )} dBm`
                              : "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            LATENCY
                          </span>

                          <strong>
                            {latest
                              ? `${formatNumber(
                                  latest.latency,
                                )} ms`
                              : "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            CLIENTS
                          </span>

                          <strong>
                            {latest
                              ?.connected_clients ??
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            TRAFFIC
                          </span>

                          <strong>
                            {latest
                              ? `${formatNumber(
                                  latest.traffic_mbps,
                                )} Mbps`
                              : "—"}
                          </strong>
                        </div>
                      </div>

                      {/* -------------------------------
                          TELEMETRY STATE
                      -------------------------------- */}

                      <div className="ap-telemetry-state">
                        <span
                          className={`telemetry-live-dot ${
                            latest
                              ? "active"
                              : ""
                          }`}
                        />

                        <span>
                          {latest
                            ? "Latest telemetry received from backend"
                            : "Waiting for telemetry"}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}