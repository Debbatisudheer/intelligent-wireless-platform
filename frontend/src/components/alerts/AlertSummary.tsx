import type { Alert } from "../../types/alert";

interface AlertSummaryProps {
  alerts: Alert[];
}

export default function AlertSummary({
  alerts,
}: AlertSummaryProps) {
  const openAlerts = alerts.filter(
    (alert) => alert.status?.toLowerCase() === "open",
  ).length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity?.toLowerCase() === "critical",
  ).length;

  const highAlerts = alerts.filter(
    (alert) => alert.severity?.toLowerCase() === "high",
  ).length;

  const activeIncidents = alerts.filter(
    (alert) =>
      alert.status?.toLowerCase() === "open" ||
      alert.status?.toLowerCase() === "active",
  ).length;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span className="card-label">OPEN ALERTS</span>
        <strong>{openAlerts}</strong>
        <span className="card-meta">
          Active network conditions
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">CRITICAL</span>
        <strong className="critical-value">
          {criticalAlerts}
        </strong>
        <span className="card-meta">
          Immediate attention required
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">HIGH SEVERITY</span>
        <strong>{highAlerts}</strong>
        <span className="card-meta">
          High-priority alerts
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">ACTIVE CONDITIONS</span>
        <strong>{activeIncidents}</strong>
        <span className="card-meta">
          Currently requiring review
        </span>
      </div>
    </div>
  );
}