import type {
  NetworkNodeType,
} from "../../types/networkVisualization";

interface NetworkNodeProps {
  type: NetworkNodeType;
  id: number;
  name: string;
  status: string;
  selected: boolean;
  childCount?: number;
  onClick: () => void;
}

function getNodeLabel(type: NetworkNodeType) {
  switch (type) {
    case "site":
      return "SITE";

    case "access-point":
      return "ACCESS POINT";

    case "radio":
      return "RADIO";

    case "client":
      return "CLIENT";

    default:
      return "NODE";
  }
}

export default function NetworkNode({
  type,
  id,
  name,
  status,
  selected,
  childCount = 0,
  onClick,
}: NetworkNodeProps) {
  const normalizedStatus =
    status?.toLowerCase() || "unknown";

  const isHealthy =
    normalizedStatus === "online" ||
    normalizedStatus === "connected" ||
    normalizedStatus === "active";

  return (
    <button
      type="button"
      className={`network-node network-node-${type} ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="network-node-top">
        <span
          className={`network-node-indicator ${
            isHealthy ? "healthy" : "unhealthy"
          }`}
        />

        <span className="network-node-type">
          {getNodeLabel(type)}
        </span>
      </div>

      <strong className="network-node-name">
        {name}
      </strong>

      <div className="network-node-meta">
        <span>ID {id}</span>

        {childCount > 0 && (
          <span>
            {childCount} connected
          </span>
        )}
      </div>
    </button>
  );
}