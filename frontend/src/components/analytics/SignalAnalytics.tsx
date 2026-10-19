import { useEffect, useMemo, useState } from "react";

import Panel from "../Panel";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";

import { getSignalAnalytics } from "../../services/analytics";

import type {
  SignalAnalyticsData,
} from "../../types/analytics";

function formatRssi(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(1)} dBm`;
}

function formatTimestamp(
  value: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Unknown";
  }

  return date.toLocaleString();
}

function getSignalDescription(
  value: number | null,
): string {
  if (value === null) {
    return "No signal data available";
  }

  if (value >= -50) {
    return "Excellent signal";
  }

  if (value >= -60) {
    return "Good signal";
  }

  if (value >= -70) {
    return "Fair signal";
  }

  return "Weak signal";
}

function getSignalClass(
  value: number | null,
): string {
  if (value === null) {
    return "";
  }

  if (value >= -60) {
    return "signal-good";
  }

  if (value >= -70) {
    return "signal-warning";
  }

  return "signal-critical";
}

function getHistoryBarWidth(
  rssi: number,
): number {
  const minimum = -80;
  const maximum = -35;

  const normalized =
    ((rssi - minimum) /
      (maximum - minimum)) *
    100;

  return Math.max(
    4,
    Math.min(100, normalized),
  );
}

export default function SignalAnalytics() {
  const [analytics, setAnalytics] =
    useState<SignalAnalyticsData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [retrying, setRetrying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadAnalytics = async (
    isRetry = false,
  ) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data =
        await getSignalAnalytics();

      setAnalytics(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load signal analytics.";

      setError(message);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void loadAnalytics();
  }, []);

  const latestTimestamp =
    useMemo(() => {
      if (
        !analytics ||
        analytics.history.length === 0
      ) {
        return null;
      }

      return analytics.history[
        analytics.history.length - 1
      ].createdAt;
    }, [analytics]);

  if (loading) {
    return (
      <LoadingState
        title="Loading signal analytics"
        message="Retrieving RSSI telemetry from the wireless network."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Signal analytics unavailable"
        message={error}
        onRetry={() =>
          void loadAnalytics(true)
        }
        retrying={retrying}
      />
    );
  }

  if (
    !analytics ||
    analytics.history.length === 0
  ) {
    return (
      <div className="empty-state">
        <strong>
          No signal telemetry available
        </strong>

        <span>
          RSSI measurements will appear here
          when wireless telemetry is available.
        </span>
      </div>
    );
  }

  return (
    <div className="analytics-signal-section">
      <Panel
        eyebrow="SIGNAL ANALYTICS"
        title="RSSI Overview"
        rightContent={
          <span className="topology-count">
            Radio {analytics.radioId ?? "—"}
          </span>
        }
      >
        <div className="summary-grid">
          <div
            className={`metric-card ${getSignalClass(
              analytics.currentRssi,
            )}`}
          >
            <span className="metric-label">
              CURRENT RSSI
            </span>

            <strong>
              {formatRssi(
                analytics.currentRssi,
              )}
            </strong>

            <span className="metric-description">
              {getSignalDescription(
                analytics.currentRssi,
              )}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              AVERAGE RSSI
            </span>

            <strong>
              {formatRssi(
                analytics.averageRssi,
              )}
            </strong>

            <span className="metric-description">
              Average across available telemetry
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              STRONGEST RSSI
            </span>

            <strong>
              {formatRssi(
                analytics.strongestRssi,
              )}
            </strong>

            <span className="metric-description">
              Best recorded signal
            </span>
          </div>

          <div className="metric-card warning">
            <span className="metric-label">
              WEAKEST RSSI
            </span>

            <strong>
              {formatRssi(
                analytics.weakestRssi,
              )}
            </strong>

            <span className="metric-description">
              Lowest recorded signal
            </span>
          </div>
        </div>

        <div className="panel-header">
          <div>
            <span className="eyebrow">
              HISTORICAL TELEMETRY
            </span>

            <h3>RSSI History</h3>
          </div>

          {latestTimestamp && (
            <span className="topology-count">
              Latest:{" "}
              {formatTimestamp(
                latestTimestamp,
              )}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {analytics.history.map(
            (point) => (
              <div
                key={point.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "145px minmax(120px, 1fr) 90px",
                  alignItems: "center",
                  gap: "16px",
                  padding:
                    "10px 0",
                  borderBottom:
                    "1px solid var(--border-color, #263142)",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color:
                      "var(--muted-text, #7f8da3)",
                  }}
                >
                  {formatTimestamp(
                    point.createdAt,
                  )}
                </span>

                <div
                  style={{
                    height: "8px",
                    borderRadius: "999px",
                    background:
                      "var(--border-color, #263142)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${getHistoryBarWidth(
                        point.rssi,
                      )}%`,
                      height: "100%",
                      borderRadius:
                        "999px",
                      background:
                        "var(--accent-color, #4f8cff)",
                    }}
                  />
                </div>

                <strong
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    color:
                      "var(--primary-text, #f4f7fb)",
                  }}
                >
                  {formatRssi(
                    point.rssi,
                  )}
                </strong>
              </div>
            ),
          )}
        </div>
      </Panel>
    </div>
  );
}