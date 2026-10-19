interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  warning?: boolean;
}

export default function MetricCard({
  label,
  value,
  description,
  warning = false,
}: MetricCardProps) {
  return (
    <div
      className={`metric-card ${
        warning ? "warning" : ""
      }`}
    >
      <span className="metric-label">
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <span className="metric-description">
        {description}
      </span>
    </div>
  );
}
