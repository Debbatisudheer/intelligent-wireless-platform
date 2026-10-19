import { useEffect, useMemo, useState } from "react";
import Panel from "../components/Panel";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import AccessPointDetails from "../components/access-points/AccessPointDetails";
import { api } from "../services/api";
import type { AccessPoint } from "../types/accessPoint";

interface Radio {
  id: number;
  access_point_id: number;
  band: string;
  channel: number;
  status: string;
}

interface Telemetry {
  id: number;
  radio_id: number;
  rssi: number;
  snr: number;
  noise_floor?: number;
  channel_utilization: number;
  packet_loss: number;
  latency: number;
  connected_clients?: number;
  traffic_mbps?: number;
  created_at?: string;
}

type SortField =
  | "name"
  | "ip_address"
  | "status";

export default function AccessPointsPage() {
  const [accessPoints, setAccessPoints] =
    useState<AccessPoint[]>([]);

  const [radios, setRadios] =
    useState<Radio[]>([]);

  const [telemetry, setTelemetry] =
    useState<Telemetry[]>([]);

  const [
    selectedAccessPoint,
    setSelectedAccessPoint,
  ] = useState<AccessPoint | null>(
    null,
  );

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sortField, setSortField] =
    useState<SortField>("name");

  const [sortAscending, setSortAscending] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [retrying, setRetrying] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [actionMessage, setActionMessage] =
    useState<string | null>(null);

  const loadAccessPoints = async (
    options: {
      isRetry?: boolean;
      isRefresh?: boolean;
    } = {},
  ) => {
    const {
      isRetry = false,
      isRefresh = false,
    } = options;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [
        accessPointResponse,
        radioResponse,
        telemetryResponse,
      ] = await Promise.all([
        api.getAccessPoints(),
        api.getRadios(),
        api.getTelemetry(),
      ]);

      const accessPointPayload =
        accessPointResponse as {
          data?: AccessPoint[];
        };

      const radioPayload =
        radioResponse as {
          data?: Radio[];
        };

      const telemetryPayload =
        telemetryResponse as {
          data?: Telemetry[];
        };

      setAccessPoints(
        accessPointPayload.data ?? [],
      );

      setRadios(
        radioPayload.data ?? [],
      );

      setTelemetry(
        telemetryPayload.data ?? [],
      );

      if (isRefresh) {
        setActionMessage(
          "Telemetry refreshed successfully.",
        );
      } else if (!isRetry) {
        setActionMessage(null);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load access point data.";

      setError(message);

      if (isRefresh) {
        setActionMessage(
          "Telemetry refresh failed.",
        );
      }
    } finally {
      setLoading(false);
      setRetrying(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadAccessPoints();
  }, []);

  const filteredAccessPoints =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      const filtered =
        accessPoints.filter(
          (accessPoint) => {
            const matchesSearch =
              normalizedSearch.length ===
                0 ||
              accessPoint.name
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              accessPoint.ip_address
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              accessPoint.mac_address
                .toLowerCase()
                .includes(
                  normalizedSearch,
                );

            const normalizedStatus =
              accessPoint.status.toLowerCase();

            const matchesStatus =
              statusFilter === "all" ||
              normalizedStatus ===
                statusFilter;

            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );

      return [...filtered].sort(
        (a, b) => {
          const left =
            a[sortField].toLowerCase();

          const right =
            b[sortField].toLowerCase();

          const result =
            left.localeCompare(right);

          return sortAscending
            ? result
            : -result;
        },
      );
    }, [
      accessPoints,
      search,
      statusFilter,
      sortField,
      sortAscending,
    ]);

  const onlineCount =
    accessPoints.filter(
      (accessPoint) =>
        accessPoint.status.toLowerCase() ===
        "online",
    ).length;

  const offlineCount =
    accessPoints.filter(
      (accessPoint) =>
        accessPoint.status.toLowerCase() !==
        "online",
    ).length;

  const handleSort = (
    field: SortField,
  ) => {
    if (sortField === field) {
      setSortAscending(
        (current) => !current,
      );

      return;
    }

    setSortField(field);
    setSortAscending(true);
  };

  const handleRefreshTelemetry = async () => {
    setActionMessage(null);

    await loadAccessPoints({
      isRefresh: true,
    });
  };

  const handleRecheckStatus = async () => {
    setActionMessage(null);

    await loadAccessPoints({
      isRefresh: true,
    });

    setActionMessage(
      "Access point and radio status rechecked.",
    );
  };

  const handleInspect = (
    accessPoint: AccessPoint,
  ) => {
    setActionMessage(null);
    setSelectedAccessPoint(
      accessPoint,
    );
  };

  if (loading) {
    return (
      <LoadingState
        title="Loading access points"
        message="Retrieving wireless infrastructure from the network API."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Access point data unavailable"
        message={error}
        onRetry={() =>
          void loadAccessPoints({
            isRetry: true,
          })
        }
        retrying={retrying}
      />
    );
  }

  return (
    <div className="page">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">
        <div>
          <span className="eyebrow">
            INFRASTRUCTURE
          </span>

          <h2>Access Points</h2>

          <p>
            Monitor and inspect wireless
            access point infrastructure.
          </p>
        </div>

        <div className="page-header-status">
          <StatusBadge
            status="Realtime"
            online
          />
        </div>
      </div>

      {/* =====================================================
          ACTION MESSAGE
      ====================================================== */}

      {actionMessage && (
        <div className="access-point-action-message">
          <span className="telemetry-live-dot active" />

          <span>{actionMessage}</span>
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="summary-grid">
        <div className="summary-card">
          <span className="card-label">
            TOTAL APs
          </span>

          <strong>
            {accessPoints.length}
          </strong>

          <span className="card-meta">
            Registered access points
          </span>
        </div>

        <div className="summary-card">
          <span className="card-label">
            ONLINE
          </span>

          <strong>
            {onlineCount}
          </strong>

          <span className="card-meta">
            Operational access points
          </span>
        </div>

        <div className="summary-card">
          <span className="card-label">
            OFFLINE
          </span>

          <strong
            className={
              offlineCount > 0
                ? "warning-value"
                : ""
            }
          >
            {offlineCount}
          </strong>

          <span className="card-meta">
            Require attention
          </span>
        </div>

        <div className="summary-card">
          <span className="card-label">
            VISIBLE
          </span>

          <strong>
            {filteredAccessPoints.length}
          </strong>

          <span className="card-meta">
            Current filtered results
          </span>
        </div>
      </div>

      {/* =====================================================
          ACCESS POINT INVENTORY
      ====================================================== */}

      <Panel
        eyebrow="ACCESS POINT INVENTORY"
        title="Wireless Infrastructure"
        rightContent={
          <div className="access-point-panel-actions">
            <button
              type="button"
              className="management-action-button"
              onClick={() =>
                void handleRefreshTelemetry()
              }
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh Telemetry"}
            </button>

            <button
              type="button"
              className="management-action-button"
              onClick={() =>
                void handleRecheckStatus()
              }
              disabled={refreshing}
            >
              {refreshing
                ? "Checking..."
                : "Recheck Status"}
            </button>

            <span className="topology-count">
              {filteredAccessPoints.length}{" "}
              results
            </span>
          </div>
        }
      >
        {/* ===================================================
            TOOLBAR
        ==================================================== */}

        <div className="access-point-toolbar">
          <div className="access-point-search">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search name, IP address or MAC address..."
              aria-label="Search access points"
            />
          </div>

          <div className="access-point-controls">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              aria-label="Filter access points by status"
            >
              <option value="all">
                All statuses
              </option>

              <option value="online">
                Online
              </option>

              <option value="offline">
                Offline
              </option>
            </select>

            <select
              value={sortField}
              onChange={(event) =>
                setSortField(
                  event.target
                    .value as SortField,
                )
              }
              aria-label="Sort access points"
            >
              <option value="name">
                Sort by name
              </option>

              <option value="ip_address">
                Sort by IP address
              </option>

              <option value="status">
                Sort by status
              </option>
            </select>

            <button
              type="button"
              className="sort-direction-button"
              onClick={() =>
                setSortAscending(
                  (current) => !current,
                )
              }
              aria-label="Toggle sort direction"
            >
              {sortAscending
                ? "A–Z"
                : "Z–A"}
            </button>
          </div>
        </div>

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {filteredAccessPoints.length ===
        0 ? (
          <div className="empty-state">
            <strong>
              No access points found
            </strong>

            <span>
              No access points match the
              current search or filter
              criteria.
            </span>
          </div>
        ) : (
          <div className="access-point-management-table">
            {/* ===============================================
                TABLE HEADER
            ================================================ */}

            <div className="access-point-management-header">
              <button
                type="button"
                onClick={() =>
                  handleSort("name")
                }
              >
                ACCESS POINT
              </button>

              <span>
                NETWORK
              </span>

              <span>
                MAC ADDRESS
              </span>

              <button
                type="button"
                onClick={() =>
                  handleSort("status")
                }
              >
                STATUS
              </button>

              <span>
                ACTIONS
              </span>
            </div>

            {/* ===============================================
                ACCESS POINT ROWS
            ================================================ */}

            {filteredAccessPoints.map(
              (accessPoint) => {
                const online =
                  accessPoint.status
                    .toLowerCase() ===
                  "online";

                return (
                  <div
                    className="access-point-management-row"
                    key={accessPoint.id}
                  >
                    <div className="management-ap-identity">
                      <div className="access-point-icon">
                        AP
                      </div>

                      <div>
                        <strong>
                          {
                            accessPoint.name
                          }
                        </strong>

                        <span>
                          AP ID:{" "}
                          {
                            accessPoint.id
                          }
                        </span>
                      </div>
                    </div>

                    <div className="management-network">
                      <strong>
                        {
                          accessPoint.ip_address
                        }
                      </strong>

                      <span>
                        Site ID:{" "}
                        {
                          accessPoint.site_id
                        }
                      </span>
                    </div>

                    <div className="management-mac">
                      {
                        accessPoint.mac_address
                      }
                    </div>

                    <div>
                      <StatusBadge
                        status={
                          online
                            ? "Online"
                            : "Offline"
                        }
                        online={online}
                      />
                    </div>

                    <div className="access-point-row-actions">
                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() =>
                          handleInspect(
                            accessPoint,
                          )
                        }
                      >
                        Inspect
                      </button>

                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() =>
                          void handleRefreshTelemetry()
                        }
                        disabled={refreshing}
                      >
                        Refresh
                      </button>

                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() =>
                          void handleRecheckStatus()
                        }
                        disabled={refreshing}
                      >
                        Recheck
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </Panel>

      {/* =====================================================
          ACCESS POINT DETAILS
      ====================================================== */}

      <AccessPointDetails
        accessPoint={
          selectedAccessPoint
        }
        radios={radios}
        telemetry={telemetry}
        onClose={() =>
          setSelectedAccessPoint(null)
        }
      />
    </div>
  );
}