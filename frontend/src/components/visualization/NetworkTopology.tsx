import type {
  NetworkNodeSelection,
  NetworkVisualizationData,
  VisualizationAccessPoint,
  VisualizationClient,
  VisualizationRadio,
} from "../../types/networkVisualization";

import NetworkNode from "./NetworkNode";

interface NetworkTopologyProps {
  data: NetworkVisualizationData;
  selectedNode: NetworkNodeSelection | null;
  onSelectNode: (
    selection: NetworkNodeSelection,
  ) => void;
}

export default function NetworkTopology({
  data,
  selectedNode,
  onSelectNode,
}: NetworkTopologyProps) {
  if (data.sites.length === 0) {
    return (
      <div className="empty-state">
        <strong>No network topology available</strong>
        <span>
          The backend returned no sites or network
          resources.
        </span>
      </div>
    );
  }

  return (
    <div className="network-topology">
      <div className="topology-header">
        <div>
          <span className="eyebrow">
            LIVE NETWORK TOPOLOGY
          </span>

          <h3>
            Site Infrastructure
          </h3>
        </div>

        <span className="topology-legend">
          Click any node for details
        </span>
      </div>

      <div className="topology-canvas">
        {data.sites.map((site) => {
          const siteAccessPoints =
            data.accessPoints.filter(
              (accessPoint) =>
                accessPoint.site_id === site.id,
            );

          return (
            <div
              className="topology-site"
              key={`site-${site.id}`}
            >
              <div className="topology-site-node">
                <NetworkNode
                  type="site"
                  id={site.id}
                  name={site.name}
                  status="online"
                  selected={
                    selectedNode?.type === "site" &&
                    selectedNode.id === site.id
                  }
                  childCount={
                    siteAccessPoints.length
                  }
                  onClick={() =>
                    onSelectNode({
                      type: "site",
                      id: site.id,
                    })
                  }
                />
              </div>

              <div className="topology-connector vertical" />

              <div className="topology-ap-grid">
                {siteAccessPoints.map(
                  (accessPoint) => (
                    <AccessPointBranch
                      key={`ap-${accessPoint.id}`}
                      accessPoint={accessPoint}
                      radios={data.radios}
                      clients={data.clients}
                      selectedNode={selectedNode}
                      onSelectNode={onSelectNode}
                    />
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AccessPointBranchProps {
  accessPoint: VisualizationAccessPoint;
  radios: VisualizationRadio[];
  clients: VisualizationClient[];
  selectedNode: NetworkNodeSelection | null;
  onSelectNode: (
    selection: NetworkNodeSelection,
  ) => void;
}

function AccessPointBranch({
  accessPoint,
  radios,
  clients,
  selectedNode,
  onSelectNode,
}: AccessPointBranchProps) {
  const accessPointRadios = radios.filter(
    (radio) =>
      radio.access_point_id === accessPoint.id,
  );

  const accessPointClients = clients.filter(
    (client) =>
      client.access_point_id === accessPoint.id,
  );

  return (
    <div className="topology-ap-branch">
      <div className="topology-connector vertical" />

      <NetworkNode
        type="access-point"
        id={accessPoint.id}
        name={accessPoint.name}
        status={accessPoint.status}
        selected={
          selectedNode?.type === "access-point" &&
          selectedNode.id === accessPoint.id
        }
        childCount={
          accessPointRadios.length +
          accessPointClients.length
        }
        onClick={() =>
          onSelectNode({
            type: "access-point",
            id: accessPoint.id,
          })
        }
      />

      <div className="topology-connector vertical" />

      <div className="topology-radio-grid">
        {accessPointRadios.map((radio) => {
          const radioClients = clients.filter(
            (client) =>
              client.radio_id === radio.id,
          );

          return (
            <div
              className="topology-radio-branch"
              key={`radio-${radio.id}`}
            >
              <NetworkNode
                type="radio"
                id={radio.id}
                name={`${radio.band} / CH ${radio.channel}`}
                status={radio.status}
                selected={
                  selectedNode?.type === "radio" &&
                  selectedNode.id === radio.id
                }
                childCount={
                  radioClients.length
                }
                onClick={() =>
                  onSelectNode({
                    type: "radio",
                    id: radio.id,
                  })
                }
              />

              {radioClients.length > 0 && (
                <>
                  <div className="topology-connector vertical" />

                  <div className="topology-client-grid">
                    {radioClients.map((client) => (
                      <NetworkNode
                        key={`client-${client.id}`}
                        type="client"
                        id={client.id}
                        name={
                          client.hostname ||
                          client.name ||
                          client.mac_address
                        }
                        status={client.status}
                        selected={
                          selectedNode?.type ===
                            "client" &&
                          selectedNode.id ===
                            client.id
                        }
                        onClick={() =>
                          onSelectNode({
                            type: "client",
                            id: client.id,
                          })
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}