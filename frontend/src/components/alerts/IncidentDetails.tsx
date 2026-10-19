import type { Incident } from "../../types/incident";

interface IncidentDetailsProps {
  incident: Incident | null;
  onClose: () => void;
}

export default function IncidentDetails({
  incident,
  onClose,
}: IncidentDetailsProps) {
  if (!incident) {
    return null;
  }

  return (
    <div className="details-overlay">
      <div className="details-panel">
        <div className="details-header">
          <div>
            <span className="eyebrow">
              INCIDENT DETAIL
            </span>

            <h2>
              {incident.title ||
                incident.name ||
                `Incident #${incident.id}`}
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
            <span>Incident ID</span>
            <strong>{incident.id}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{incident.status}</strong>
          </div>

          <div>
            <span>Severity</span>
            <strong>
              {incident.severity || "—"}
            </strong>
          </div>

          <div>
            <span>Alert</span>
            <strong>
              {incident.alert_id ?? "—"}
            </strong>
          </div>

          <div>
            <span>Site</span>
            <strong>
              {incident.site_id ?? "—"}
            </strong>
          </div>

          <div>
            <span>Access Point</span>
            <strong>
              {incident.access_point_id ?? "—"}
            </strong>
          </div>

          <div>
            <span>Radio</span>
            <strong>
              {incident.radio_id ?? "—"}
            </strong>
          </div>
        </div>

        {incident.description && (
          <div className="details-description">
            <span>DESCRIPTION</span>
            <p>{incident.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}