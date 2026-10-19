import Panel from "../Panel";
import StatusBadge from "../StatusBadge";

interface Client {
  id: number;
  site_id: number;
  status?: string;
  mac_address?: string;
  hostname?: string;
  ip_address?: string;
  name?: string;
}

interface Site {
  id: number;
  name: string;
}

interface ClientConnectivityProps {
  clients: Client[];
  sites: Site[];
}

function normalizeStatus(status?: string) {
  return status?.toLowerCase() ?? "unknown";
}

function isConnected(status?: string) {
  const normalized = normalizeStatus(status);

  return (
    normalized === "connected" ||
    normalized === "online" ||
    normalized === "active"
  );
}

function calculateConnectivityHealth(
  clients: Client[],
) {
  if (clients.length === 0) {
    return "Waiting";
  }

  const connectedClients = clients.filter(
    (client) => isConnected(client.status),
  ).length;

  const connectivityRate =
    (connectedClients / clients.length) * 100;

  if (connectivityRate < 50) {
    return "Critical";
  }

  if (connectivityRate < 80) {
    return "Attention";
  }

  return "Healthy";
}

export default function ClientConnectivity({
  clients,
  sites,
}: ClientConnectivityProps) {
  if (clients.length === 0) {
    return (
      <Panel
        eyebrow="CLIENTS"
        title="Client Connectivity"
      >
        <div className="empty-state">
          <strong>
            No clients available
          </strong>

          <span>
            No client connectivity data has
            been returned by the API.
          </span>
        </div>
      </Panel>
    );
  }

  const connectedClients =
    clients.filter((client) =>
      isConnected(client.status),
    ).length;

  const disconnectedClients =
    clients.length - connectedClients;

  const connectivityHealth =
    calculateConnectivityHealth(clients);

  const connectivityRate =
    clients.length > 0
      ? (connectedClients /
          clients.length) *
        100
      : 0;

  return (
    <Panel
      eyebrow="CLIENTS"
      title="Client Connectivity"
      rightContent={
        <StatusBadge
          status={connectivityHealth}
          online={
            connectivityHealth ===
            "Healthy"
          }
        />
      }
    >
      <div className="client-connectivity-summary">
        <div className="client-summary-stat">
          <span>Total Clients</span>
          <strong>{clients.length}</strong>
        </div>

        <div className="client-summary-stat">
          <span>Connected</span>
          <strong>
            {connectedClients}
          </strong>
        </div>

        <div className="client-summary-stat">
          <span>Disconnected</span>
          <strong>
            {disconnectedClients}
          </strong>
        </div>

        <div className="client-summary-stat">
          <span>Connectivity</span>
          <strong>
            {connectivityRate.toFixed(1)}%
          </strong>
        </div>
      </div>

      <div className="client-connectivity-list">
        {clients.map((client) => {
          const site = sites.find(
            (item) =>
              item.id === client.site_id,
          );

          const connected =
            isConnected(client.status);

          const clientName =
            client.name ??
            client.hostname ??
            client.mac_address ??
            `Client ${client.id}`;

          return (
            <div
              className="client-connectivity-card"
              key={client.id}
            >
              <div className="client-connectivity-identity">
                <div className="client-indicator">
                  {clientName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {clientName}
                  </strong>

                  <span>
                    {client.ip_address ??
                      client.mac_address ??
                      `Client ID: ${client.id}`}
                  </span>
                </div>
              </div>

              <div className="client-connectivity-meta">
                <div>
                  <span>Site</span>

                  <strong>
                    {site?.name ??
                      "Unknown Site"}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <StatusBadge
                    status={
                      connected
                        ? "Connected"
                        : client.status ??
                          "Unknown"
                    }
                    online={connected}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}