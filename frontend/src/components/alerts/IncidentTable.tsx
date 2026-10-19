import type { Incident } from "../../types/incident";

interface IncidentTableProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

export default function IncidentTable({
  incidents,
  onSelect,
}: IncidentTableProps) {
  if (incidents.length === 0) {
    return (
      <div className="empty-state">
        <strong>No incidents found</strong>
        <span>
          There are currently no incidents to display.
        </span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Alert</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              onClick={() => onSelect(incident)}
              className="clickable-row"
            >
              <td>
                <div className="table-primary">
                  {incident.title ||
                    incident.name ||
                    `Incident #${incident.id}`}
                </div>

                {incident.description && (
                  <div className="table-secondary">
                    {incident.description}
                  </div>
                )}
              </td>

              <td>
                {incident.severity || "—"}
              </td>

              <td>
                {incident.status}
              </td>

              <td>
                {incident.alert_id ?? "—"}
              </td>

              <td>
                {incident.created_at
                  ? new Date(
                      incident.created_at,
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