import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

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

interface TelemetryData {
  radio_id: number;
  rssi: number;
  snr: number;
  channel_utilization: number;
  packet_loss: number;
}

interface AccessPointHealthProps {
  accessPoints: AccessPoint[];
  radios: Radio[];
  telemetry: TelemetryData[];
}

function getHealth(
  telemetry: TelemetryData[],
) {
  if (telemetry.length === 0) {
    return "Waiting";
  }

  const averageUtilization =
    telemetry.reduce(
      (sum, item) =>
        sum + item.channel_utilization,
      0,
    ) / telemetry.length;

  const averagePacketLoss =
    telemetry.reduce(
      (sum, item) =>
        sum + item.packet_loss,
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

export default function AccessPointHealth({
  accessPoints,
  radios,
  telemetry,
}: AccessPointHealthProps) {
  if (accessPoints.length === 0) {
    return (
      <Panel
        eyebrow="ACCESS POINTS"
        title="Access Point Health"
      >
        <div className="empty-state">
          <strong>
            No access points available
          </strong>

          <span>
            No access point data has been
            returned by the API.
          </span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      eyebrow="ACCESS POINTS"
      title="Access Point Health"
    >
      <div className="access-point-list">
        {accessPoints.map((accessPoint) => {
          const accessPointRadios =
            radios.filter(
              (radio) =>
                radio.access_point_id ===
                accessPoint.id,
            );

          const radioIds =
            accessPointRadios.map(
              (radio) => radio.id,
            );

          const accessPointTelemetry =
            telemetry.filter((item) =>
              radioIds.includes(
                item.radio_id,
              ),
            );

          const health =
            getHealth(
              accessPointTelemetry,
            );

          const online =
            accessPoint.status.toLowerCase() ===
            "online";

          const averageRssi =
            accessPointTelemetry.length > 0
              ? accessPointTelemetry.reduce(
                  (sum, item) =>
                    sum + item.rssi,
                  0,
                ) /
                accessPointTelemetry.length
              : null;

          const averageSnr =
            accessPointTelemetry.length > 0
              ? accessPointTelemetry.reduce(
                  (sum, item) =>
                    sum + item.snr,
                  0,
                ) /
                accessPointTelemetry.length
              : null;

          const averageUtilization =
            accessPointTelemetry.length > 0
              ? accessPointTelemetry.reduce(
                  (sum, item) =>
                    sum +
                    item.channel_utilization,
                  0,
                ) /
                accessPointTelemetry.length
              : null;

          const averagePacketLoss =
            accessPointTelemetry.length > 0
              ? accessPointTelemetry.reduce(
                  (sum, item) =>
                    sum +
                    item.packet_loss,
                  0,
                ) /
                accessPointTelemetry.length
              : null;

          return (
            <div
              className="access-point-card"
              key={accessPoint.id}
            >
              <div className="access-point-header">
                <div className="access-point-identity">
                  <div className="access-point-icon">
                    AP
                  </div>

                  <div>
                    <strong>
                      {accessPoint.name}
                    </strong>

                    <span>
                      {accessPoint.ip_address}
                    </span>
                  </div>
                </div>

                <div className="access-point-status">
                  <StatusBadge
                    status={
                      online
                        ? "Online"
                        : "Offline"
                    }
                    online={online}
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

              <div className="access-point-meta">
                <span>
                  MAC {accessPoint.mac_address}
                </span>

                <span>
                  {accessPointRadios.length}{" "}
                  {accessPointRadios.length ===
                  1
                    ? "radio"
                    : "radios"}
                </span>
              </div>

              <div className="access-point-metrics">
                <div>
                  <span>RSSI</span>
                  <strong>
                    {averageRssi !== null
                      ? `${averageRssi.toFixed(
                          1,
                        )} dBm`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>SNR</span>
                  <strong>
                    {averageSnr !== null
                      ? `${averageSnr.toFixed(
                          1,
                        )} dB`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Channel Util.</span>
                  <strong>
                    {averageUtilization !==
                    null
                      ? `${averageUtilization.toFixed(
                          1,
                        )}%`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>Packet Loss</span>
                  <strong>
                    {averagePacketLoss !==
                    null
                      ? `${averagePacketLoss.toFixed(
                          2,
                        )}%`
                      : "—"}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}