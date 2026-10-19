interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export default function ErrorState({
  title,
  message,
  onRetry,
  retrying = false,
}: ErrorStateProps) {
  return (
    <div className="api-error-banner">
      <div>
        <strong>{title}</strong>

        <span>{message}</span>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? "Retrying..." : "Retry"}
        </button>
      )}
    </div>
  );
}