import type {
  RealtimeConnectionState,
} from "../../hooks/useRealtimeDashboard";

interface RealtimeConnectionStatusProps {
  state: RealtimeConnectionState;
  updateCount: number;
  lastUpdatedAt: string | null;
}

function getLabel(
  state: RealtimeConnectionState,
): string {
  switch (state) {
    case "connected":
      return "Realtime connected";

    case "connecting":
      return "Connecting";

    case "disconnected":
      return "Disconnected";

    case "error":
      return "Connection error";
  }
}

export default function RealtimeConnectionStatus({
  state,
  updateCount,
  lastUpdatedAt,
}: RealtimeConnectionStatusProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        gap: "16px",
        flexWrap: "wrap",
        padding: "12px 16px",
        border:
          "1px solid var(--border-color, #263142)",
        borderRadius: "10px",
        background:
          "var(--panel-background, #101722)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          className={`status-dot ${
            state === "connected"
              ? "online"
              : ""
          }`}
        />

        <strong>
          {getLabel(state)}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          gap: "18px",
          flexWrap: "wrap",
          fontSize: "12px",
          color:
            "var(--muted-text, #8c98aa)",
        }}
      >
        <span>
          Updates: {updateCount}
        </span>

        <span>
          Last update:{" "}
          {lastUpdatedAt
            ? new Date(
                lastUpdatedAt,
              ).toLocaleTimeString()
            : "Waiting"}
        </span>
      </div>
    </div>
  );
}