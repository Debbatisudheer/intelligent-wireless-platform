import type { Alert } from "../../types/alert";

interface AlertTableProps {
  alerts: Alert[];
  onSelect: (alert: Alert) => void;
}

function severityClass(severity: string) {
  return `severity-badge ${severity.toLowerCase()}`;
}

function statusClass(status: string) {
  return `alert-status ${status.toLowerCase()}`;
}

export default function AlertTable({
  alerts,
  onSelect,
}: AlertTableProps) {
  if (alerts.length === 0) {
    return (
      <div className="empty-state">
        <strong>No alerts found</strong>
        <span>
          No alerts match the current search and filters.
        </span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Alert</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Metric</th>
            <th>Value</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((alert) => (
            <tr
              key={alert.id}
              onClick={() => onSelect(alert)}
              className="clickable-row"
            >
              <td>
                <div className="table-primary">
                  {alert.name ||
                    alert.message ||
                    `Alert #${alert.id}`}
                </div>

                {alert.message &&
                  alert.name && (
                    <div className="table-secondary">
                      {alert.message}
                    </div>
                  )}
              </td>

              <td>
                <span
                  className={severityClass(
                    alert.severity || "unknown",
                  )}
                >
                  {alert.severity || "Unknown"}
                </span>
              </td>

              <td>
                <span
                  className={statusClass(
                    alert.status || "unknown",
                  )}
                >
                  {alert.status || "Unknown"}
                </span>
              </td>

              <td>
                {alert.metric || "—"}
              </td>

              <td>
                {alert.value ?? "—"}
              </td>

              <td>
                {alert.created_at
                  ? new Date(
                      alert.created_at,
                    ).toLocaleString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}