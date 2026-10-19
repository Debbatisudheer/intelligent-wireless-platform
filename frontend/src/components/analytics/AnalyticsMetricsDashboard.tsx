import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Panel from "../Panel";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import StatusBadge from "../StatusBadge";

import {
  getAnalyticsDataset,
} from "../../services/analytics";

import type {
  AnalyticsDataset,
  TelemetryRecord,
} from "../../types/analytics";

type MetricKey =
  | "channel"
  | "packet"
  | "latency"
  | "traffic";

type TimeFilter =
  | "all"
  | "24h"
  | "12h"
  | "6h";

function formatNumber(
  value: number | null,
  suffix = "",
): string {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(1)}${suffix}`;
}

function formatTimestamp(
  timestamp: string,
): string {
  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Unknown";
  }

  return date.toLocaleString();
}

function getMetricLabel(
  metric: MetricKey,
): string {
  switch (metric) {
    case "channel":
      return "Channel Utilization";

    case "packet":
      return "Packet Loss";

    case "latency":
      return "Latency";

    case "traffic":
      return "Traffic";
  }
}

function getMetricUnit(
  metric: MetricKey,
): string {
  switch (metric) {
    case "channel":
      return "%";

    case "packet":
      return "%";

    case "latency":
      return " ms";

    case "traffic":
      return " Mbps";
  }
}

function getMetricValue(
  record: TelemetryRecord,
  metric: MetricKey,
): number {
  switch (metric) {
    case "channel":
      return record.channel_utilization;

    case "packet":
      return record.packet_loss;

    case "latency":
      return record.latency;

    case "traffic":
      return record.traffic_mbps;
  }
}

function getBarWidth(
  value: number,
  metric: MetricKey,
): number {
  let maximum = 100;

  if (metric === "latency") {
    maximum = 100;
  }

  if (metric === "traffic") {
    maximum = 500;
  }

  const percentage =
    (value / maximum) * 100;

  return Math.max(
    4,
    Math.min(100, percentage),
  );
}

function getHealthClass(
  metric: MetricKey,
  value: number | null,
): string {
  if (value === null) {
    return "";
  }

  if (metric === "channel") {
    if (value <= 50) {
      return "signal-good";
    }

    if (value <= 75) {
      return "signal-warning";
    }

    return "signal-critical";
  }

  if (metric === "packet") {
    if (value <= 1) {
      return "signal-good";
    }

    if (value <= 3) {
      return "signal-warning";
    }

    return "signal-critical";
  }

  if (metric === "latency") {
    if (value <= 20) {
      return "signal-good";
    }

    if (value <= 50) {
      return "signal-warning";
    }

    return "signal-critical";
  }

  return "";
}

export default function AnalyticsMetricsDashboard() {
  const [dataset, setDataset] =
    useState<AnalyticsDataset | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [retrying, setRetrying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [radioFilter, setRadioFilter] =
    useState<string>("all");

  const [timeFilter, setTimeFilter] =
    useState<TimeFilter>("all");

  const loadAnalytics =
    async (
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
          await getAnalyticsDataset();

        setDataset(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load wireless analytics.",
        );
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

  useEffect(() => {
    void loadAnalytics();
  }, []);

  const radioIds =
    useMemo(() => {
      if (!dataset) {
        return [];
      }

      return Array.from(
        new Set(
          dataset.records.map(
            (record) =>
              record.radio_id,
          ),
        ),
      ).sort(
        (a, b) => a - b,
      );
    }, [dataset]);

  const filteredRecords =
    useMemo(() => {
      if (!dataset) {
        return [];
      }

      const now =
        Date.now();

      let cutoff: number | null =
        null;

      if (timeFilter === "24h") {
        cutoff =
          now -
          24 *
            60 *
            60 *
            1000;
      }

      if (timeFilter === "12h") {
        cutoff =
          now -
          12 *
            60 *
            60 *
            1000;
      }

      if (timeFilter === "6h") {
        cutoff =
          now -
          6 *
            60 *
            60 *
            1000;
      }

      return dataset.records.filter(
        (record) => {
          const matchesRadio =
            radioFilter === "all" ||
            String(
              record.radio_id,
            ) === radioFilter;

          const timestamp =
            new Date(
              record.created_at,
            ).getTime();

          const matchesTime =
            cutoff === null ||
            timestamp >= cutoff;

          return (
            matchesRadio &&
            matchesTime
          );
        },
      );
    }, [
      dataset,
      radioFilter,
      timeFilter,
    ]);

  const calculateMetric =
    (
      metric: MetricKey,
    ) => {
      const values =
        filteredRecords
          .map((record) =>
            getMetricValue(
              record,
              metric,
            ),
          )
          .filter(
            (value) =>
              Number.isFinite(value),
          );

      if (
        values.length === 0
      ) {
        return {
          current: null,
          average: null,
          highest: null,
          lowest: null,
        };
      }

      const sorted =
        [...filteredRecords]
          .sort(
            (a, b) =>
              new Date(
                a.created_at,
              ).getTime() -
              new Date(
                b.created_at,
              ).getTime(),
          );

      const current =
        getMetricValue(
          sorted[
            sorted.length - 1
          ],
          metric,
        );

      return {
        current,
        average:
          values.reduce(
            (
              sum,
              value,
            ) =>
              sum + value,
            0,
          ) / values.length,
        highest:
          Math.max(...values),
        lowest:
          Math.min(...values),
      };
    };

  const channel =
    calculateMetric(
      "channel",
    );

  const packet =
    calculateMetric(
      "packet",
    );

  const latency =
    calculateMetric(
      "latency",
    );

  const traffic =
    calculateMetric(
      "traffic",
    );

  const clearFilters =
    () => {
      setRadioFilter("all");
      setTimeFilter("all");
    };

  if (loading) {
    return (
      <LoadingState
        title="Loading wireless analytics"
        message="Retrieving network telemetry and calculating analytics."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Analytics unavailable"
        message={error}
        onRetry={() =>
          void loadAnalytics(
            true,
          )
        }
        retrying={retrying}
      />
    );
  }

  if (
    !dataset ||
    dataset.records.length === 0
  ) {
    return (
      <div className="empty-state">
        <strong>
          No telemetry available
        </strong>

        <span>
          Wireless analytics will appear
          when telemetry records are
          available.
        </span>
      </div>
    );
  }

  const metricCards = [
    {
      key: "channel" as const,
      label: "CHANNEL UTILIZATION",
      value: formatNumber(
        channel.current,
        "%",
      ),
      description:
        "Current channel occupancy",
    },
    {
      key: "packet" as const,
      label: "PACKET LOSS",
      value: formatNumber(
        packet.current,
        "%",
      ),
      description:
        "Current packet loss",
    },
    {
      key: "latency" as const,
      label: "LATENCY",
      value: formatNumber(
        latency.current,
        " ms",
      ),
      description:
        "Current network latency",
    },
    {
      key: "traffic" as const,
      label: "TRAFFIC",
      value: formatNumber(
        traffic.current,
        " Mbps",
      ),
      description:
        "Current traffic throughput",
    },
  ];

  return (
    <div className="analytics-dashboard">
      <Panel
        eyebrow="ANALYTICS CONTROLS"
        title="Telemetry Filters"
        rightContent={
          <StatusBadge
            status="Live Data"
            online
          />
        }
      >
        <div className="access-point-toolbar">
          <div className="access-point-controls">
            <select
              value={radioFilter}
              onChange={(event) =>
                setRadioFilter(
                  event.target.value,
                )
              }
              aria-label="Filter analytics by radio"
            >
              <option value="all">
                All radios
              </option>

              {radioIds.map(
                (radioId) => (
                  <option
                    key={radioId}
                    value={String(
                      radioId,
                    )}
                  >
                    Radio {radioId}
                  </option>
                ),
              )}
            </select>

            <select
              value={timeFilter}
              onChange={(event) =>
                setTimeFilter(
                  event.target
                    .value as TimeFilter,
                )
              }
              aria-label="Filter analytics by time"
            >
              <option value="all">
                All telemetry
              </option>

              <option value="24h">
                Last 24 hours
              </option>

              <option value="12h">
                Last 12 hours
              </option>

              <option value="6h">
                Last 6 hours
              </option>
            </select>

            <button
              type="button"
              className="management-action-button"
              onClick={
                clearFilters
              }
            >
              Reset
            </button>
          </div>

          <span className="topology-count">
            {filteredRecords.length}{" "}
            telemetry records
          </span>
        </div>
      </Panel>

      <div className="summary-grid">
        {metricCards.map(
          (card) => (
            <div
              key={card.key}
              className={`metric-card ${getHealthClass(
                card.key,
                card.key ===
                  "channel"
                  ? channel.current
                  : card.key ===
                    "packet"
                  ? packet.current
                  : card.key ===
                    "latency"
                  ? latency.current
                  : traffic.current,
              )}`}
            >
              <span className="metric-label">
                {card.label}
              </span>

              <strong>
                {card.value}
              </strong>

              <span className="metric-description">
                {card.description}
              </span>
            </div>
          ),
        )}
      </div>

      <Panel
        eyebrow="CHANNEL ANALYTICS"
        title="Channel Utilization"
      >
        <div className="summary-grid">
          <div className="metric-card">
            <span className="metric-label">
              CURRENT
            </span>

            <strong>
              {formatNumber(
                channel.current,
                "%",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              AVERAGE
            </span>

            <strong>
              {formatNumber(
                channel.average,
                "%",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              HIGHEST
            </span>

            <strong>
              {formatNumber(
                channel.highest,
                "%",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              LOWEST
            </span>

            <strong>
              {formatNumber(
                channel.lowest,
                "%",
              )}
            </strong>
          </div>
        </div>
      </Panel>

      <Panel
        eyebrow="RELIABILITY ANALYTICS"
        title="Packet Loss"
      >
        <div className="summary-grid">
          <div className="metric-card">
            <span className="metric-label">
              CURRENT
            </span>

            <strong>
              {formatNumber(
                packet.current,
                "%",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              AVERAGE
            </span>

            <strong>
              {formatNumber(
                packet.average,
                "%",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              HIGHEST
            </span>

            <strong>
              {formatNumber(
                packet.highest,
                "%",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              LOWEST
            </span>

            <strong>
              {formatNumber(
                packet.lowest,
                "%",
              )}
            </strong>
          </div>
        </div>
      </Panel>

      <Panel
        eyebrow="PERFORMANCE ANALYTICS"
        title="Latency"
      >
        <div className="summary-grid">
          <div className="metric-card">
            <span className="metric-label">
              CURRENT
            </span>

            <strong>
              {formatNumber(
                latency.current,
                " ms",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              AVERAGE
            </span>

            <strong>
              {formatNumber(
                latency.average,
                " ms",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              HIGHEST
            </span>

            <strong>
              {formatNumber(
                latency.highest,
                " ms",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              LOWEST
            </span>

            <strong>
              {formatNumber(
                latency.lowest,
                " ms",
              )}
            </strong>
          </div>
        </div>
      </Panel>

      <Panel
        eyebrow="THROUGHPUT ANALYTICS"
        title="Traffic"
      >
        <div className="summary-grid">
          <div className="metric-card">
            <span className="metric-label">
              CURRENT
            </span>

            <strong>
              {formatNumber(
                traffic.current,
                " Mbps",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              AVERAGE
            </span>

            <strong>
              {formatNumber(
                traffic.average,
                " Mbps",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              HIGHEST
            </span>

            <strong>
              {formatNumber(
                traffic.highest,
                " Mbps",
              )}
            </strong>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              LOWEST
            </span>

            <strong>
              {formatNumber(
                traffic.lowest,
                " Mbps",
              )}
            </strong>
          </div>
        </div>
      </Panel>

      <Panel
        eyebrow="TELEMETRY VISUALIZATION"
        title="Network Performance Timeline"
        rightContent={
          <span className="topology-count">
            {filteredRecords.length} points
          </span>
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {[
            {
              key: "channel" as const,
              label:
                "Channel Utilization",
            },
            {
              key: "packet" as const,
              label: "Packet Loss",
            },
            {
              key: "latency" as const,
              label: "Latency",
            },
            {
              key: "traffic" as const,
              label: "Traffic",
            },
          ].map(
            (metric) => (
              <div
                key={metric.key}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "8px",
                  }}
                >
                  <strong>
                    {metric.label}
                  </strong>

                  <span className="topology-count">
                    {
                      filteredRecords.length
                    }{" "}
                    samples
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "flex-end",
                    gap: "5px",
                    height: "100px",
                    overflowX:
                      "auto",
                    padding:
                      "8px 0",
                  }}
                >
                  {[
                    ...filteredRecords,
                  ]
                    .sort(
                      (a, b) =>
                        new Date(
                          a.created_at,
                        ).getTime() -
                        new Date(
                          b.created_at,
                        ).getTime(),
                    )
                    .map(
                      (
                        record,
                      ) => {
                        const value =
                          getMetricValue(
                            record,
                            metric.key,
                          );

                        return (
                          <div
                            key={`${metric.key}-${record.id}`}
                            title={`${getMetricLabel(
                              metric.key,
                            )}: ${value}${getMetricUnit(
                              metric.key,
                            )}`}
                            style={{
                              minWidth:
                                "10px",
                              height: `${getBarWidth(
                                value,
                                metric.key,
                              )}%`,
                              borderRadius:
                                "4px 4px 0 0",
                              background:
                                "var(--accent-color, #4f8cff)",
                            }}
                          />
                        );
                      },
                    )}
                </div>
              </div>
            ),
          )}
        </div>
      </Panel>

      <Panel
        eyebrow="HISTORICAL TELEMETRY"
        title="Telemetry Records"
        rightContent={
          <span className="topology-count">
            {filteredRecords.length}{" "}
            records
          </span>
        }
      >
        {filteredRecords.length ===
        0 ? (
          <div className="empty-state">
            <strong>
              No matching telemetry
            </strong>

            <span>
              Change the selected radio or
              time range to view historical
              telemetry.
            </span>
          </div>
        ) : (
          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <div
              style={{
                minWidth:
                  "900px",
              }}
            >
              {[
                ...filteredRecords,
              ]
                .sort(
                  (a, b) =>
                    new Date(
                      b.created_at,
                    ).getTime() -
                    new Date(
                      a.created_at,
                    ).getTime(),
                )
                .map(
                  (record) => (
                    <div
                      key={
                        record.id
                      }
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "150px 70px 80px 110px 90px 90px 110px",
                        gap: "14px",
                        alignItems:
                          "center",
                        padding:
                          "12px 0",
                        borderBottom:
                          "1px solid var(--border-color, #263142)",
                        fontSize:
                          "12px",
                      }}
                    >
                      <span>
                        {formatTimestamp(
                          record.created_at,
                        )}
                      </span>

                      <strong>
                        R{record.radio_id}
                      </strong>

                      <span>
                        RSSI{" "}
                        {record.rssi.toFixed(
                          1,
                        )}
                      </span>

                      <span>
                        SNR{" "}
                        {record.snr.toFixed(
                          1,
                        )}
                      </span>

                      <span>
                        CH{" "}
                        {record.channel_utilization.toFixed(
                          1,
                        )}
                        %
                      </span>

                      <span>
                        Loss{" "}
                        {record.packet_loss.toFixed(
                          2,
                        )}
                        %
                      </span>

                      <span>
                        {record.traffic_mbps.toFixed(
                          1,
                        )}{" "}
                        Mbps
                      </span>
                    </div>
                  ),
                )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}