import Panel from "../Panel";

import type {
  TelemetryRecord,
} from "../../types/analytics";

interface LiveTelemetryPanelProps {
  telemetry:
    | TelemetryRecord
    | null;
}

function value(
  number: number | null | undefined,
  suffix = "",
) {
  if (
    number === null ||
    number === undefined
  ) {
    return "—";
  }

  return `${number.toFixed(1)}${suffix}`;
}

export default function LiveTelemetryPanel({
  telemetry,
}: LiveTelemetryPanelProps) {
  return (
    <Panel
      eyebrow="REAL-TIME TELEMETRY"
      title="Live Wireless Metrics"
    >
      {!telemetry ? (
        <div className="empty-state">
          <strong>
            Waiting for telemetry
          </strong>

          <span>
            The dashboard is connected and
            waiting for the next wireless
            telemetry event.
          </span>
        </div>
      ) : (
        <>
          <div className="summary-grid">
            <div className="metric-card">
              <span className="metric-label">
                RSSI
              </span>

              <strong>
                {value(
                  telemetry.rssi,
                  " dBm",
                )}
              </strong>

              <span className="metric-description">
                Radio {telemetry.radio_id}
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                SNR
              </span>

              <strong>
                {value(
                  telemetry.snr,
                  " dB",
                )}
              </strong>

              <span className="metric-description">
                Signal-to-noise ratio
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                CHANNEL
              </span>

              <strong>
                {value(
                  telemetry.channel_utilization,
                  "%",
                )}
              </strong>

              <span className="metric-description">
                Channel utilization
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                PACKET LOSS
              </span>

              <strong>
                {value(
                  telemetry.packet_loss,
                  "%",
                )}
              </strong>

              <span className="metric-description">
                Packet loss
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                LATENCY
              </span>

              <strong>
                {value(
                  telemetry.latency,
                  " ms",
                )}
              </strong>

              <span className="metric-description">
                Network latency
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                CLIENTS
              </span>

              <strong>
                {
                  telemetry.connected_clients
                }
              </strong>

              <span className="metric-description">
                Connected clients
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                TRAFFIC
              </span>

              <strong>
                {value(
                  telemetry.traffic_mbps,
                  " Mbps",
                )}
              </strong>

              <span className="metric-description">
                Current throughput
              </span>
            </div>

            <div className="metric-card">
              <span className="metric-label">
                NOISE FLOOR
              </span>

              <strong>
                {value(
                  telemetry.noise_floor,
                  " dBm",
                )}
              </strong>

              <span className="metric-description">
                Radio noise floor
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "12px",
              color:
                "var(--muted-text, #8c98aa)",
            }}
          >
            Telemetry record #
            {telemetry.id} · Radio{" "}
            {telemetry.radio_id} ·{" "}
            {new Date(
              telemetry.created_at,
            ).toLocaleString()}
          </div>
        </>
      )}
    </Panel>
  );
}