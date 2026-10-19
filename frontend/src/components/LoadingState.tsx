interface LoadingStateProps {
  title: string;
  message: string;
}

export default function LoadingState({
  title,
  message,
}: LoadingStateProps) {
  return (
    <div className="empty-state">
      <div className="loading-indicator" />

      <strong>
        {title}
      </strong>

      <span>
        {message}
      </span>
    </div>
  );
}
