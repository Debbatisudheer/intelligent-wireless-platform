import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

interface Site {
  id: number;
  name: string;
}

interface SiteOverviewProps {
  site: Site | null;
  accessPoints: number;
  radios: number;
  onlineAccessPoints: number;
  onlineRadios: number;
  networkHealth: string;
}

export default function SiteOverview({
  site,
  accessPoints,
  radios,
  onlineAccessPoints,
  onlineRadios,
  networkHealth,
}: SiteOverviewProps) {
  if (!site) {
    return (
      <Panel
        eyebrow="SITE"
        title="Site Overview"
      >
        <div className="empty-state">
          <strong>No site available</strong>
          <span>
            No network site has been returned by the API.
          </span>
        </div>
      </Panel>
    );
  }

  const siteHealthy =
    networkHealth === "Healthy";

  return (
    <Panel
      eyebrow="SITE"
      title="Site Overview"
      rightContent={
        <StatusBadge
          status={networkHealth}
          online={siteHealthy}
        />
      }
    >
      <div className="site-overview">
        <div className="site-identity">
          <div className="site-indicator">
            {site.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{site.name}</strong>
            <span>Site ID: {site.id}</span>
          </div>
        </div>

        <div className="site-metrics">
          <div className="site-metric">
            <span>Access Points</span>
            <strong>{accessPoints}</strong>
            <small>
              {onlineAccessPoints} online
            </small>
          </div>

          <div className="site-metric">
            <span>Radios</span>
            <strong>{radios}</strong>
            <small>
              {onlineRadios} online
            </small>
          </div>

          <div className="site-metric">
            <span>Network Health</span>
            <strong>{networkHealth}</strong>
            <small>
              Current network state
            </small>
          </div>
        </div>
      </div>
    </Panel>
  );
}