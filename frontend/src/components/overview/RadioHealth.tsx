import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

interface Radio {
  id: number;
  access_point_id: number;
  band: string;
  channel: number;
  status: string;
}

interface AccessPoint {
  id: number;
  name: string;
}

interface TelemetryData {
  radio_id: number;
  rssi: number;
  snr: number;
  channel_utilization: number;
  packet_loss: number;
}

interface RadioHealthProps {
  radios: Radio[];
  accessPoints: AccessPoint[];
  telemetry: TelemetryData[];
}

function calculateRadioHealth(
  records: TelemetryData[],
) {
  if (records.length === 0) {
    return "Waiting";
  }

  const utilization =
    records.reduce(
      (sum, item) =>
        sum + item.channel_utilization,
      0,
    ) / records.length;

  const packetLoss =
    records.reduce(
      (sum, item) =>
        sum + item.packet_loss,
      0,
    ) / records.length;

  if (
    utilization >= 85 ||
    packetLoss >= 10
  ) {
    return "Critical";
  }

  if (
    utilization >= 60 ||
    packetLoss >= 3
  ) {
    return "Attention";
  }

  return "Healthy";
}

export default function RadioHealth({
  radios,
  accessPoints,
  telemetry,
}: RadioHealthProps) {
  if (radios.length === 0) {
    return (
      <Panel
        eyebrow="RADIOS"
        title="Radio Health"
      >
        <div className="empty-state">
          <strong>
            No radios available
          </strong>

          <span>
            No radio data has been returned
            by the API.
          </span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      eyebrow="RADIOS"
      title="Radio Health"
    >
      <div className="radio-health-list">
        {radios.map((radio) => {
          const accessPoint =
            accessPoints.find(
              (item) =>
                item.id ===
                radio.access_point_id,
            );

          const radioTelemetry =
            telemetry.filter(
              (item) =>
                item.radio_id === radio.id,
            );

          const health =
            calculateRadioHealth(
              radioTelemetry,
            );

          const online =
            radio.status.toLowerCase() ===
            "online";

          const averageRssi =
            radioTelemetry.length > 0
              ? radioTelemetry.reduce(
                  (sum, item) =>
                    sum + item.rssi,
                  0,
                ) /
                radioTelemetry.length
              : null;

          const averageSnr =
            radioTelemetry.length > 0
              ? radioTelemetry.reduce(
                  (sum, item) =>
                    sum + item.snr,
                  0,
                ) /
                radioTelemetry.length
              : null;

          const averageUtilization =
            radioTelemetry.length > 0
              ? radioTelemetry.reduce(
                  (sum, item) =>
                    sum +
                    item.channel_utilization,
                  0,
                ) /
                radioTelemetry.length
              : null;

          const averagePacketLoss =
            radioTelemetry.length > 0
              ? radioTelemetry.reduce(
                  (sum, item) =>
                    sum +
                    item.packet_loss,
                  0,
                ) /
                radioTelemetry.length
              : null;

          return (
            <div
              className="radio-health-card"
              key={radio.id}
            >
              <div className="radio-health-header">
                <div className="radio-identity">
                  <div className="radio-band">
                    {radio.band}
                  </div>

                  <div>
                    <strong>
                      {accessPoint?.name ??
                        "Unknown AP"}
                    </strong>

                    <span>
                      Channel{" "}
                      {radio.channel}
                    </span>
                  </div>
                </div>

                <div className="radio-status">
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

              <div className="radio-health-metrics">
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