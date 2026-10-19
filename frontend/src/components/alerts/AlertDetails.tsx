import type { Alert } from "../../types/alert";

interface AlertDetailsProps {
  alert: Alert | null;
  onClose: () => void;
}

export default function AlertDetails({
  alert,
  onClose,
}: AlertDetailsProps) {
  if (!alert) {
    return null;
  }

  return (
    <div className="details-overlay">
      <div className="details-panel">
        <div className="details-header">
          <div>
            <span className="eyebrow">
              ALERT DETAIL
            </span>

            <h2>
              {alert.name ||
                alert.message ||
                `Alert #${alert.id}`}
            </h2>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="details-grid">
          <div>
            <span>Alert ID</span>
            <strong>{alert.id}</strong>
          </div>

          <div>
            <span>Severity</span>
            <strong>
              {alert.severity || "Unknown"}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <strong>
              {alert.status || "Unknown"}
            </strong>
          </div>

          <div>
            <span>Metric</span>
            <strong>
              {alert.metric || "—"}
            </strong>
          </div>

          <div>
            <span>Current Value</span>
            <strong>
              {alert.value ?? "—"}
            </strong>
          </div>

          <div>
            <span>Threshold</span>
            <strong>
              {alert.threshold ?? "—"}
            </strong>
          </div>

          <div>
            <span>Site</span>
            <strong>
              {alert.site_id ?? "—"}
            </strong>
          </div>

          <div>
            <span>Access Point</span>
            <strong>
              {alert.access_point_id ?? "—"}
            </strong>
          </div>

          <div>
            <span>Radio</span>
            <strong>
              {alert.radio_id ?? "—"}
            </strong>
          </div>

          <div>
            <span>Alert Rule</span>
            <strong>
              {alert.alert_rule_id ?? "—"}
            </strong>
          </div>
        </div>

        {alert.message && (
          <div className="details-description">
            <span>MESSAGE</span>
            <p>{alert.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}