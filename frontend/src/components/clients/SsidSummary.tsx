import type { Ssid } from "../../types/ssid";

interface SsidSummaryProps {
  ssids: Ssid[];
}

function isActive(
  status: string,
): boolean {
  const normalized =
    status.trim().toLowerCase();

  return (
    normalized === "active" ||
    normalized === "online" ||
    normalized === "enabled"
  );
}

export default function SsidSummary({
  ssids,
}: SsidSummaryProps) {
  const activeCount =
    ssids.filter((ssid) =>
      isActive(ssid.status),
    ).length;

  const inactiveCount =
    ssids.length - activeCount;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span className="card-label">
          TOTAL SSIDS
        </span>

        <strong>
          {ssids.length}
        </strong>

        <span className="card-meta">
          Configured wireless networks
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">
          ACTIVE
        </span>

        <strong>
          {activeCount}
        </strong>

        <span className="card-meta">
          Currently active SSIDs
        </span>
      </div>

      <div className="summary-card">
        <span className="card-label">
          INACTIVE
        </span>

        <strong
          className={
            inactiveCount > 0
              ? "warning-value"
              : ""
          }
        >
          {inactiveCount}
        </strong>

        <span className="card-meta">
          Currently unavailable
        </span>
      </div>
    </div>
  );
}