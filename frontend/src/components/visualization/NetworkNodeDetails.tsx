import type {
  NetworkNodeSelection,
  NetworkVisualizationData,
} from "../../types/networkVisualization";

interface NetworkNodeDetailsProps {
  data: NetworkVisualizationData;
  selection: NetworkNodeSelection | null;
  onClose: () => void;
}

export default function NetworkNodeDetails({
  data,
  selection,
  onClose,
}: NetworkNodeDetailsProps) {
  if (!selection) {
    return null;
  }

  const node = findNode(data, selection);

  if (!node) {
    return null;
  }

  return (
    <div className="visualization-details">
      <div className="visualization-details-header">
        <div>
          <span className="eyebrow">
            NODE INSPECTOR
          </span>

          <h3>{node.name}</h3>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="visualization-details-grid">
        <div>
          <span>TYPE</span>
          <strong>{node.type}</strong>
        </div>

        <div>
          <span>ID</span>
          <strong>{node.id}</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong>{node.status}</strong>
        </div>

        {node.macAddress && (
          <div>
            <span>MAC ADDRESS</span>
            <strong>{node.macAddress}</strong>
          </div>
        )}

        {node.ipAddress && (
          <div>
            <span>IP ADDRESS</span>
            <strong>{node.ipAddress}</strong>
          </div>
        )}

        {node.band && (
          <div>
            <span>BAND</span>
            <strong>{node.band}</strong>
          </div>
        )}

        {node.channel !== undefined && (
          <div>
            <span>CHANNEL</span>
            <strong>{node.channel}</strong>
          </div>
        )}

        {node.rssi !== undefined &&
          node.rssi !== null && (
            <div>
              <span>RSSI</span>
              <strong>{node.rssi} dBm</strong>
            </div>
          )}

        {node.snr !== undefined &&
          node.snr !== null && (
            <div>
              <span>SNR</span>
              <strong>{node.snr} dB</strong>
            </div>
          )}
      </div>
    </div>
  );
}

interface NormalizedNode {
  type: string;
  id: number;
  name: string;
  status: string;
  macAddress?: string;
  ipAddress?: string;
  band?: string;
  channel?: number;
  rssi?: number | null;
  snr?: number | null;
}

function findNode(
  data: NetworkVisualizationData,
  selection: NetworkNodeSelection,
): NormalizedNode | null {
  if (selection.type === "site") {
    const site = data.sites.find(
      (item) => item.id === selection.id,
    );

    if (!site) {
      return null;
    }

    return {
      type: "Site",
      id: site.id,
      name: site.name,
      status: "online",
    };
  }

  if (selection.type === "access-point") {
    const accessPoint =
      data.accessPoints.find(
        (item) => item.id === selection.id,
      );

    if (!accessPoint) {
      return null;
    }

    return {
      type: "Access Point",
      id: accessPoint.id,
      name: accessPoint.name,
      status: accessPoint.status,
      macAddress: accessPoint.mac_address,
      ipAddress: accessPoint.ip_address,
    };
  }

  if (selection.type === "radio") {
    const radio = data.radios.find(
      (item) => item.id === selection.id,
    );

    if (!radio) {
      return null;
    }

    return {
      type: "Radio",
      id: radio.id,
      name: `${radio.band} / CH ${radio.channel}`,
      status: radio.status,
      band: radio.band,
      channel: radio.channel,
    };
  }

  const client = data.clients.find(
    (item) => item.id === selection.id,
  );

  if (!client) {
    return null;
  }

  return {
    type: "Client",
    id: client.id,
    name:
      client.hostname ||
      client.name ||
      client.mac_address,
    status: client.status,
    macAddress: client.mac_address,
    ipAddress: client.ip_address ?? undefined,
    rssi: client.rssi,
    snr: client.snr,
  };
}