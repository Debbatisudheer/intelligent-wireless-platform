import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

interface Site {
  id: number;
  name: string;
}

interface AccessPoint {
  id: number;
  name: string;
  ip_address: string;
  status: string;
}

interface Radio {
  id: number;
  access_point_id: number;
  band: string;
  channel: number;
  status: string;
}

interface NetworkStatusVisualizationProps {
  site: Site | null;
  accessPoints: AccessPoint[];
  radios: Radio[];
}

function isOnline(status: string) {
  return status.toLowerCase() === "online";
}

export default function NetworkStatusVisualization({
  site,
  accessPoints,
  radios,
}: NetworkStatusVisualizationProps) {
  if (!site) {
    return (
      <Panel
        eyebrow="NETWORK TOPOLOGY"
        title="Network Status"
      >
        <div className="empty-state">
          <strong>No network topology available</strong>
          <span>
            A site is required to display the network status.
          </span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      eyebrow="NETWORK TOPOLOGY"
      title="Network Status"
      rightContent={
        <span className="topology-count">
          {accessPoints.length} AP
          {accessPoints.length === 1 ? "" : "s"}
        </span>
      }
    >
      <div className="network-topology">
        <div className="topology-site">
          <div className="topology-node site-node">
            <div className="topology-node-icon">SITE</div>

            <div className="topology-node-content">
              <strong>{site.name}</strong>
              <span>Site ID: {site.id}</span>
            </div>

            <StatusBadge
              status="Online"
              online
            />
          </div>

          <div className="topology-line vertical" />

          <div className="topology-access-points">
            {accessPoints.length === 0 ? (
              <div className="empty-state">
                <strong>No access points</strong>
                <span>
                  No access point data is available.
                </span>
              </div>
            ) : (
              accessPoints.map((accessPoint) => {
                const accessPointRadios =
                  radios.filter(
                    (radio) =>
                      radio.access_point_id ===
                      accessPoint.id,
                  );

                const online =
                  isOnline(accessPoint.status);

                return (
                  <div
                    className="topology-branch"
                    key={accessPoint.id}
                  >
                    <div className="topology-line horizontal" />

                    <div className="topology-ap-group">
                      <div className="topology-node access-point-node">
                        <div className="topology-node-icon ap-icon">
                          AP
                        </div>

                        <div className="topology-node-content">
                          <strong>
                            {accessPoint.name}
                          </strong>

                          <span>
                            {accessPoint.ip_address}
                          </span>
                        </div>

                        <StatusBadge
                          status={
                            online
                              ? "Online"
                              : "Offline"
                          }
                          online={online}
                        />
                      </div>

                      <div className="topology-line vertical short" />

                      <div className="topology-radios">
                        {accessPointRadios.length ===
                        0 ? (
                          <div className="topology-empty">
                            No radios
                          </div>
                        ) : (
                          accessPointRadios.map(
                            (radio) => {
                              const radioOnline =
                                isOnline(
                                  radio.status,
                                );

                              return (
                                <div
                                  className="topology-radio"
                                  key={radio.id}
                                >
                                  <div className="radio-node-indicator">
                                    <span
                                      className={`status-dot ${
                                        radioOnline
                                          ? "online"
                                          : ""
                                      }`}
                                    />
                                  </div>

                                  <div className="topology-radio-content">
                                    <strong>
                                      {radio.band}
                                    </strong>

                                    <span>
                                      Channel{" "}
                                      {radio.channel}
                                    </span>
                                  </div>

                                  <span
                                    className={`topology-radio-status ${
                                      radioOnline
                                        ? "online"
                                        : "offline"
                                    }`}
                                  >
                                    {radioOnline
                                      ? "ONLINE"
                                      : "OFFLINE"}
                                  </span>
                                </div>
                              );
                            },
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}