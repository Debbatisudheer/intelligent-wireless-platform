interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "No data available",
  message = "There is nothing to display right now.",
}: EmptyStateProps) {
  return (
    <div className="ui-state ui-empty">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}