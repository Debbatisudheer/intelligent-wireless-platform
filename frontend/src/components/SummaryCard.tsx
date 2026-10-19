interface SummaryCardProps {
  label: string;
  value: string;
  meta: string;
  loading?: boolean;
  valueClassName?: string;
}

export default function SummaryCard({
  label,
  value,
  meta,
  loading = false,
  valueClassName = "",
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <span className="card-label">{label}</span>

      {loading ? (
        <div className="summary-loading" />
      ) : (
        <strong className={valueClassName}>
          {value}
        </strong>
      )}

      <span className="card-meta">
        {loading ? "Loading..." : meta}
      </span>
    </div>
  );
}
