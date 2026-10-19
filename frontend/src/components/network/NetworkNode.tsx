import { memo } from "react";

interface NetworkNodeProps {
  label: string;
  type: string;
  status: string;
  selected?: boolean;
  onClick?: () => void;
}

function NetworkNode({
  label,
  type,
  status,
  selected = false,
  onClick,
}: NetworkNodeProps) {
  return (
    <button
      type="button"
      className={`network-node network-node-${type} ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <span className="network-node-type">
        {type}
      </span>

      <strong>{label}</strong>

      <span className="network-node-status">
        {status}
      </span>
    </button>
  );
}

export default memo(NetworkNode);