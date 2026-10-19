import Panel from "../components/Panel";

import RealtimeConnectionStatus from "../components/realtime/RealtimeConnectionStatus";
import LiveTelemetryPanel from "../components/realtime/LiveTelemetryPanel";
import RealtimeNetworkSummary from "../components/realtime/RealtimeNetworkSummary";

import {
  useRealtimeDashboard,
} from "../hooks/useRealtimeDashboard";

export default function RealtimeDashboardPage() {
  const realtime =
    useRealtimeDashboard();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            REAL-TIME OPERATIONS
          </span>

          <h2>
            Real-Time Dashboard
          </h2>

          <p>
            Monitor live wireless telemetry,
            network infrastructure, client
            state and analytics updates through
            the real-time telemetry stream.
          </p>
        </div>
      </div>

      <RealtimeConnectionStatus
        state={
          realtime.connectionState
        }
        updateCount={
          realtime.updateCount
        }
        lastUpdatedAt={
          realtime.lastUpdatedAt
        }
      />

      {realtime.error && (
        <div
          className="api-error-banner"
          style={{
            marginTop: "16px",
          }}
        >
          <div>
            <strong>
              Real-time stream warning
            </strong>

            <span>
              {realtime.error}
            </span>
          </div>
        </div>
      )}

      <LiveTelemetryPanel
        telemetry={
          realtime.latestTelemetry
        }
      />

      <RealtimeNetworkSummary
        updateSignal={
          realtime.updateCount
        }
      />

      <Panel
        eyebrow="REAL-TIME PIPELINE"
        title="Dashboard Data Flow"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          {[
            {
              title: "Telemetry Source",
              value:
                "Wireless simulator",
            },
            {
              title: "Backend",
              value:
                "Rails TelemetryService",
            },
            {
              title: "Transport",
              value:
                "ActionCable + Redis",
            },
            {
              title: "Dashboard",
              value:
                "React WebSocket client",
            },
          ].map(
            (item) => (
              <div
                key={
                  item.title
                }
                style={{
                  padding:
                    "16px",
                  border:
                    "1px solid var(--border-color, #263142)",
                  borderRadius:
                    "10px",
                  background:
                    "var(--panel-background, #101722)",
                }}
              >
                <span
                  style={{
                    display:
                      "block",
                    fontSize:
                      "11px",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.08em",
                    color:
                      "var(--muted-text, #8c98aa)",
                    marginBottom:
                      "8px",
                  }}
                >
                  {
                    item.title
                  }
                </span>

                <strong>
                  {item.value}
                </strong>
              </div>
            ),
          )}
        </div>
      </Panel>
    </div>
  );
}