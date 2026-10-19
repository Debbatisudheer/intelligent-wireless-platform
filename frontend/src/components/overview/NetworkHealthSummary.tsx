import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

interface TelemetryData {
  rssi: number;
  snr: number;
  channel_utilization: number;
  packet_loss: number;
  latency: number;
}

interface NetworkHealthSummaryProps {
  telemetry: TelemetryData[];
}

type HealthStatus =
  | "Healthy"
  | "Attention"
  | "Critical"
  | "Waiting";

interface HealthMetric {
  label: string;
  value: string;
  description: string;
  status: HealthStatus;
}

function getRssiStatus(
  value: number,
): HealthStatus {
  if (value < -75) {
    return "Critical";
  }

  if (value < -65) {
    return "Attention";
  }

  return "Healthy";
}

function getSnrStatus(
  value: number,
): HealthStatus {
  if (value < 15) {
    return "Critical";
  }

  if (value < 25) {
    return "Attention";
  }

  return "Healthy";
}

function getUtilizationStatus(
  value: number,
): HealthStatus {
  if (value >= 85) {
    return "Critical";
  }

  if (value >= 60) {
    return "Attention";
  }

  return "Healthy";
}

function getPacketLossStatus(
  value: number,
): HealthStatus {
  if (value >= 10) {
    return "Critical";
  }

  if (value >= 3) {
    return "Attention";
  }

  return "Healthy";
}

function getLatencyStatus(
  value: number,
): HealthStatus {
  if (value >= 100) {
    return "Critical";
  }

  if (value >= 50) {
    return "Attention";
  }

  return "Healthy";
}

function getOverallHealth(
  metrics: HealthMetric[],
): HealthStatus {
  if (metrics.length === 0) {
    return "Waiting";
  }

  if (
    metrics.some(
      (metric) =>
        metric.status === "Critical",
    )
  ) {
    return "Critical";
  }

  if (
    metrics.some(
      (metric) =>
        metric.status === "Attention",
    )
  ) {
    return "Attention";
  }

  return "Healthy";
}

export default function NetworkHealthSummary({
  telemetry,
}: NetworkHealthSummaryProps) {
  if (telemetry.length === 0) {
    return (
      <Panel
        eyebrow="NETWORK HEALTH"
        title="Health Summary"
        rightContent={
          <StatusBadge
            status="Waiting"
            online={false}
          />
        }
      >
        <div className="empty-state">
          <strong>
            Waiting for network telemetry
          </strong>

          <span>
            Health metrics will appear when
            telemetry data is available.
          </span>
        </div>
      </Panel>
    );
  }

  const averageRssi =
    telemetry.reduce(
      (sum, item) =>
        sum + item.rssi,
      0,
    ) / telemetry.length;

  const averageSnr =
    telemetry.reduce(
      (sum, item) =>
        sum + item.snr,
      0,
    ) / telemetry.length;

  const averageUtilization =
    telemetry.reduce(
      (sum, item) =>
        sum +
        item.channel_utilization,
      0,
    ) / telemetry.length;

  const averagePacketLoss =
    telemetry.reduce(
      (sum, item) =>
        sum + item.packet_loss,
      0,
    ) / telemetry.length;

  const averageLatency =
    telemetry.reduce(
      (sum, item) =>
        sum + item.latency,
      0,
    ) / telemetry.length;

  const metrics: HealthMetric[] = [
    {
      label: "Signal Quality",
      value: `${averageRssi.toFixed(1)} dBm`,
      description:
        "Average received signal strength",
      status: getRssiStatus(
        averageRssi,
      ),
    },
    {
      label: "SNR Quality",
      value: `${averageSnr.toFixed(1)} dB`,
      description:
        "Average signal-to-noise ratio",
      status: getSnrStatus(
        averageSnr,
      ),
    },
    {
      label: "Channel Utilization",
      value: `${averageUtilization.toFixed(1)}%`,
      description:
        "Average wireless channel load",
      status: getUtilizationStatus(
        averageUtilization,
      ),
    },
    {
      label: "Packet Loss",
      value: `${averagePacketLoss.toFixed(2)}%`,
      description:
        "Average observed packet loss",
      status: getPacketLossStatus(
        averagePacketLoss,
      ),
    },
    {
      label: "Latency",
      value: `${averageLatency.toFixed(1)} ms`,
      description:
        "Average network latency",
      status: getLatencyStatus(
        averageLatency,
      ),
    },
  ];

  const overallHealth =
    getOverallHealth(metrics);

  return (
    <Panel
      eyebrow="NETWORK HEALTH"
      title="Health Summary"
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
      <div className="network-health-summary">
        <div className="network-health-overview">
          <div className="network-health-indicator">
            <span
              className={`health-indicator-dot ${
                overallHealth.toLowerCase()
              }`}
            />
          </div>

          <div className="network-health-overview-text">
            <span>
              OVERALL NETWORK STATE
            </span>

            <strong>
              {overallHealth}
            </strong>

            <p>
              Current health is calculated
              from the available wireless
              telemetry measurements.
            </p>
          </div>
        </div>

        <div className="network-health-metrics">
          {metrics.map((metric) => (
            <div
              className="network-health-metric"
              key={metric.label}
            >
              <div className="network-health-metric-header">
                <span>
                  {metric.label}
                </span>

                <StatusBadge
                  status={metric.status}
                  online={
                    metric.status ===
                    "Healthy"
                  }
                />
              </div>

              <strong>
                {metric.value}
              </strong>

              <small>
                {metric.description}
              </small>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}