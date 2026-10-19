import type { NetworkVisualizationData } from "../../types/networkVisualization";

interface NetworkSummaryProps {
  data: NetworkVisualizationData;
}

export default function NetworkSummary({
  data,
}: NetworkSummaryProps) {
  const onlineAccessPoints = data.accessPoints.filter(
    (accessPoint) =>
      accessPoint.status?.toLowerCase() === "online",
  ).length;

  const onlineRadios = data.radios.filter(
    (radio) =>
      radio.status?.toLowerCase() === "online",
  ).length;

  const connectedClients = data.clients.filter(
    (client) =>
      client.status?.toLowerCase() === "connected" ||
      client.status?.toLowerCase() === "online",
  ).length;

  return (
    <div className="summary-grid visualization-summary">
      <div className="summary-card">
        <span className="card-label">SITES</span>
        <strong>{data.sites.length}</strong>
        <span className="card-meta">
          Network locations
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">ACCESS POINTS</span>
        <strong>{data.accessPoints.length}</strong>
        <span className="card-meta">
          {onlineAccessPoints} online
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">RADIOS</span>
        <strong>{data.radios.length}</strong>
        <span className="card-meta">
          {onlineRadios} online
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">CLIENTS</span>
        <strong>{data.clients.length}</strong>
        <span className="card-meta">
          {connectedClients} connected
        </span>
      </div>
    </div>
  );
}