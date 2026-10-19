interface StatusBadgeProps {
  status: string;
  online?: boolean;
}

export default function StatusBadge({
  status,
  online = false,
}: StatusBadgeProps) {
  return (
    <span className="device-status">
      <span
        className={`status-dot ${
          online ? "online" : ""
        }`}
      />

      {status}
    </span>
  );
}
