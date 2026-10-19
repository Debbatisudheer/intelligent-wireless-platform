import StatusBadge from "../StatusBadge";
import type { Ssid } from "../../types/ssid";

interface SsidTableProps {
  ssids: Ssid[];
  onSelect: (ssid: Ssid) => void;
}

function getSsidStatus(status: string): {
  label: string;
  online: boolean;
} {
  const normalized = status.trim().toLowerCase();

  if (
    normalized === "active" ||
    normalized === "online" ||
    normalized === "enabled"
  ) {
    return {
      label: "Active",
      online: true,
    };
  }

  if (
    normalized === "inactive" ||
    normalized === "offline" ||
    normalized === "disabled"
  ) {
    return {
      label: "Inactive",
      online: false,
    };
  }

  return {
    label: status || "Unknown",
    online: false,
  };
}

export default function SsidTable({
  ssids,
  onSelect,
}: SsidTableProps) {
  return (
    <div className="ssid-management-table">
      <div className="ssid-management-header">
        <span>SSID</span>

        <span>SECURITY</span>

        <span>SITE</span>

        <span>STATUS</span>

        <span>ACTIONS</span>
      </div>

      {ssids.map((ssid) => {
        const status = getSsidStatus(
          ssid.status,
        );

        return (
          <div
            className="ssid-management-row"
            key={ssid.id}
          >
            <div className="ssid-identity">
              <div className="ssid-icon">
                WI
              </div>

              <div>
                <strong>
                  {ssid.name}
                </strong>

                <span>
                  SSID ID: {ssid.id}
                </span>
              </div>
            </div>

            <div className="ssid-security">
              {ssid.security_type || "—"}
            </div>

            <div className="ssid-site">
              Site ID: {ssid.site_id}
            </div>

            <div>
              <StatusBadge
                status={status.label}
                online={status.online}
              />
            </div>

            <div className="ssid-actions">
              <button
                type="button"
                className="management-action-button"
                onClick={() => onSelect(ssid)}
              >
                Inspect
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}