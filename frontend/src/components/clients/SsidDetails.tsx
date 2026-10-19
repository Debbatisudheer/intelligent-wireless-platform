import StatusBadge from "../StatusBadge";
import Panel from "../Panel";

import type { Ssid } from "../../types/ssid";

interface SsidDetailsProps {
  ssid: Ssid | null;
  onClose: () => void;
}

type SsidStatus = "Active" | "Inactive" | "Unknown";

function getSsidStatus(status: string): SsidStatus {
  const normalizedStatus = status.trim().toLowerCase();

  if (
    normalizedStatus === "active" ||
    normalizedStatus === "online" ||
    normalizedStatus === "enabled"
  ) {
    return "Active";
  }

  if (
    normalizedStatus === "inactive" ||
    normalizedStatus === "offline" ||
    normalizedStatus === "disabled"
  ) {
    return "Inactive";
  }

  return "Unknown";
}

function getStatusOnline(status: SsidStatus): boolean {
  return status === "Active";
}

export default function SsidDetails({
  ssid,
  onClose,
}: SsidDetailsProps) {
  if (!ssid) {
    return null;
  }

  const resolvedStatus = getSsidStatus(ssid.status);

  return (
    <div
      className="client-details-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`SSID details for ${ssid.name}`}
    >
      <div className="client-details">
        <div className="client-details-header">
          <div>
            <span className="eyebrow">
              SSID DETAILS
            </span>

            <h2>{ssid.name}</h2>

            <div className="client-details-status">
              <StatusBadge
                status={resolvedStatus}
                online={getStatusOnline(resolvedStatus)}
              />
            </div>
          </div>

          <button
            type="button"
            className="management-action-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="client-live-summary">
          <div className="client-live-summary-card">
            <span>STATUS</span>

            <strong>{resolvedStatus}</strong>

            <small>
              Backend: {ssid.status || "Unknown"}
            </small>
          </div>

          <div className="client-live-summary-card">
            <span>SECURITY</span>

            <strong>
              {ssid.security_type || "Unknown"}
            </strong>

            <small>
              Configured security mode
            </small>
          </div>

          <div className="client-live-summary-card">
            <span>SITE</span>

            <strong>
              Site {ssid.site_id}
            </strong>

            <small>
              Wireless network location
            </small>
          </div>
        </div>

        <div className="client-connectivity-grid">
          <Panel
            eyebrow="SSID STATE"
            title="Current Status"
          >
            <div className="client-connectivity-card">
              <div className="client-connectivity-status">
                <span
                  className={`client-connectivity-indicator ${
                    resolvedStatus === "Active"
                      ? "connected"
                      : resolvedStatus === "Inactive"
                        ? "disconnected"
                        : "unknown"
                  }`}
                >
                  <span className="client-connectivity-dot" />
                </span>

                <div>
                  <strong>
                    {resolvedStatus}
                  </strong>

                  <span>
                    {resolvedStatus === "Active"
                      ? "SSID is currently active."
                      : resolvedStatus === "Inactive"
                        ? "SSID is currently inactive."
                        : "SSID status could not be classified."}
                  </span>
                </div>
              </div>

              <div className="client-connectivity-status-meta">
                <span>Backend status</span>

                <strong>
                  {ssid.status || "Unknown"}
                </strong>
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="NETWORK INFORMATION"
            title="SSID Configuration"
          >
            <div className="client-information-list">
              <div>
                <span>SSID Name</span>
                <strong>{ssid.name}</strong>
              </div>

              <div>
                <span>Security</span>
                <strong>
                  {ssid.security_type || "Unknown"}
                </strong>
              </div>

              <div>
                <span>Site ID</span>
                <strong>
                  {ssid.site_id}
                </strong>
              </div>

              <div>
                <span>SSID ID</span>
                <strong>
                  {ssid.id}
                </strong>
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          eyebrow="STATUS INTERPRETATION"
          title="Operational State"
        >
          <div className="client-information-list">
            <div>
              <span>Resolved state</span>

              <strong>
                {resolvedStatus}
              </strong>
            </div>

            <div>
              <span>Operational</span>

              <strong>
                {resolvedStatus === "Active"
                  ? "Yes"
                  : resolvedStatus === "Inactive"
                    ? "No"
                    : "Unknown"}
              </strong>
            </div>

            <div>
              <span>Backend value</span>

              <strong>
                {ssid.status || "Unknown"}
              </strong>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}