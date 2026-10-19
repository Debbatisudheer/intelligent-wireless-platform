interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="ui-state ui-loading" role="status">
      <div className="ui-state-spinner" />
      <span>{message}</span>
    </div>
  );
}