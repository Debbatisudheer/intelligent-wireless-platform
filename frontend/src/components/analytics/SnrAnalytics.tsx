import { useEffect, useMemo, useState } from "react";

import Panel from "../Panel";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";

import { getSnrAnalytics } from "../../services/analytics";

import type {
  SnrAnalyticsData,
} from "../../types/analytics";

function formatSnr(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(1)} dB`;
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

function getSnrDescription(
  value: number | null,
): string {
  if (value === null) {
    return "No SNR data available";
  }

  if (value >= 30) {
    return "Excellent signal quality";
  }

  if (value >= 20) {
    return "Good signal quality";
  }

  if (value >= 10) {
    return "Fair signal quality";
  }

  return "Poor signal quality";
}

function getSnrClass(
  value: number | null,
): string {
  if (value === null) {
    return "";
  }

  if (value >= 20) {
    return "signal-good";
  }

  if (value >= 10) {
    return "signal-warning";
  }

  return "signal-critical";
}

function getHistoryBarWidth(
  snr: number,
): number {
  const minimum = 0;
  const maximum = 50;

  const normalized =
    ((snr - minimum) /
      (maximum - minimum)) *
    100;

  return Math.max(
    4,
    Math.min(100, normalized),
  );
}

export default function SnrAnalytics() {
  const [analytics, setAnalytics] =
    useState<SnrAnalyticsData | null>(
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
        await getSnrAnalytics();

      setAnalytics(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load SNR analytics.";

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
        title="Loading SNR analytics"
        message="Retrieving signal-to-noise ratio telemetry from the wireless network."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="SNR analytics unavailable"
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
          No SNR telemetry available
        </strong>

        <span>
          SNR measurements will appear here
          when wireless telemetry is available.
        </span>
      </div>
    );
  }

  return (
    <div className="analytics-snr-section">
      <Panel
        eyebrow="SNR ANALYTICS"
        title="Signal-to-Noise Ratio"
        rightContent={
          <span className="topology-count">
            Radio {analytics.radioId ?? "—"}
          </span>
        }
      >
        <div className="summary-grid">
          <div
            className={`metric-card ${getSnrClass(
              analytics.currentSnr,
            )}`}
          >
            <span className="metric-label">
              CURRENT SNR
            </span>

            <strong>
              {formatSnr(
                analytics.currentSnr,
              )}
            </strong>

            <span className="metric-description">
              {getSnrDescription(
                analytics.currentSnr,
              )}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              AVERAGE SNR
            </span>

            <strong>
              {formatSnr(
                analytics.averageSnr,
              )}
            </strong>

            <span className="metric-description">
              Average across available telemetry
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              HIGHEST SNR
            </span>

            <strong>
              {formatSnr(
                analytics.strongestSnr,
              )}
            </strong>

            <span className="metric-description">
              Best recorded SNR
            </span>
          </div>

          <div className="metric-card warning">
            <span className="metric-label">
              LOWEST SNR
            </span>

            <strong>
              {formatSnr(
                analytics.weakestSnr,
              )}
            </strong>

            <span className="metric-description">
              Lowest recorded SNR
            </span>
          </div>
        </div>

        <div className="panel-header">
          <div>
            <span className="eyebrow">
              HISTORICAL TELEMETRY
            </span>

            <h3>SNR History</h3>
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
                        point.snr,
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
                  {formatSnr(
                    point.snr,
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