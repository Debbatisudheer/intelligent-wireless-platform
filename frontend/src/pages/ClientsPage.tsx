import { useEffect, useMemo, useState } from "react";

import Panel from "../components/Panel";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import ClientDetails from "../components/clients/ClientDetails";
import SsidSummary from "../components/clients/SsidSummary";
import SsidTable from "../components/clients/SsidTable";
import SsidDetails from "../components/clients/SsidDetails";

import { api } from "../services/api";

import type { Client } from "../types/client";
import type { Ssid } from "../types/ssid";

type SortField =
  | "name"
  | "mac_address"
  | "ip_address"
  | "status";

type ConnectivityState =
  | "Connected"
  | "Disconnected"
  | "Unknown";

type StatusFilter =
  | "all"
  | "connected"
  | "disconnected"
  | "unknown";

function getClientName(
  client: Client,
): string {
  return (
    client.name ??
    client.hostname ??
    `Client-${client.id}`
  );
}

function getConnectivityState(
  status: string,
): ConnectivityState {
  const normalizedStatus =
    status.trim().toLowerCase();

  if (
    normalizedStatus === "connected" ||
    normalizedStatus === "online"
  ) {
    return "Connected";
  }

  if (
    normalizedStatus === "disconnected" ||
    normalizedStatus === "offline"
  ) {
    return "Disconnected";
  }

  return "Unknown";
}

function getSearchableFields(
  client: Client,
): string[] {
  return [
    getClientName(client),
    client.name ?? "",
    client.hostname ?? "",
    client.mac_address,
    client.ip_address ?? "",
  ].map((value) =>
    value.trim().toLowerCase(),
  );
}

function compareValues(
  left: string,
  right: string,
): number {
  return left
    .trim()
    .toLowerCase()
    .localeCompare(
      right.trim().toLowerCase(),
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      },
    );
}

export default function ClientsPage() {
  const [clients, setClients] =
    useState<Client[]>([]);

  const [ssids, setSsids] =
    useState<Ssid[]>([]);

  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  const [selectedSsid, setSelectedSsid] =
    useState<Ssid | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [sortField, setSortField] =
    useState<SortField>("name");

  const [sortAscending, setSortAscending] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [retrying, setRetrying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadClients = async (
    isRetry = false,
  ) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [
        clientResponse,
        ssidResponse,
      ] = await Promise.all([
        api.getClients(),
        api.getSsids(),
      ]);

      const clientPayload =
        clientResponse as {
          data?: Client[];
        };

      const ssidPayload =
        ssidResponse as {
          data?: Ssid[];
        };

      setClients(
        clientPayload.data ?? [],
      );

      setSsids(
        ssidPayload.data ?? [],
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load client and SSID data.";

      setError(message);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void loadClients();
  }, []);

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredClients =
    useMemo(() => {
      return clients.filter((client) => {
        const searchableFields =
          getSearchableFields(client);

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableFields.some(
            (field) =>
              field.includes(
                normalizedSearch,
              ),
          );

        const connectivity =
          getConnectivityState(
            client.status,
          );

        const matchesStatus =
          statusFilter === "all" ||
          connectivity.toLowerCase() ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      });
    }, [
      clients,
      normalizedSearch,
      statusFilter,
    ]);

  const sortedClients =
    useMemo(() => {
      return [...filteredClients].sort(
        (a, b) => {
          let left = "";
          let right = "";

          switch (sortField) {
            case "name":
              left = getClientName(a);
              right = getClientName(b);
              break;

            case "mac_address":
              left = a.mac_address;
              right = b.mac_address;
              break;

            case "ip_address":
              left =
                a.ip_address ?? "";
              right =
                b.ip_address ?? "";
              break;

            case "status":
              left =
                getConnectivityState(
                  a.status,
                );

              right =
                getConnectivityState(
                  b.status,
                );
              break;
          }

          const result =
            compareValues(
              left,
              right,
            );

          return sortAscending
            ? result
            : -result;
        },
      );
    }, [
      filteredClients,
      sortField,
      sortAscending,
    ]);

  const connectedCount =
    clients.filter(
      (client) =>
        getConnectivityState(
          client.status,
        ) === "Connected",
    ).length;

  const disconnectedCount =
    clients.filter(
      (client) =>
        getConnectivityState(
          client.status,
        ) === "Disconnected",
    ).length;

  const unknownCount =
    clients.filter(
      (client) =>
        getConnectivityState(
          client.status,
        ) === "Unknown",
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

  const clearSearch = () => {
    setSearch("");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== "all";

  if (loading) {
    return (
      <LoadingState
        title="Loading clients"
        message="Retrieving wireless client and SSID information from the network API."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Client data unavailable"
        message={error}
        onRetry={() =>
          void loadClients(true)
        }
        retrying={retrying}
      />
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            CLIENT MANAGEMENT
          </span>

          <h2>Clients</h2>

          <p>
            Monitor, filter and sort
            wireless clients across the
            network.
          </p>
        </div>

        <div className="page-header-status">
          <StatusBadge
            status="Realtime"
            online
          />
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="card-label">
            TOTAL CLIENTS
          </span>

          <strong>
            {clients.length}
          </strong>

          <span className="card-meta">
            Registered wireless clients
          </span>
        </div>

        <div className="summary-card">
          <span className="card-label">
            CONNECTED
          </span>

          <strong>
            {connectedCount}
          </strong>

          <span className="card-meta">
            Currently connected clients
          </span>
        </div>

        <div className="summary-card">
          <span className="card-label">
            DISCONNECTED
          </span>

          <strong
            className={
              disconnectedCount > 0
                ? "warning-value"
                : ""
            }
          >
            {disconnectedCount}
          </strong>

          <span className="card-meta">
            Currently unavailable
          </span>
        </div>

        <div className="summary-card">
          <span className="card-label">
            VISIBLE
          </span>

          <strong>
            {sortedClients.length}
          </strong>

          <span className="card-meta">
            After current filters
          </span>
        </div>
      </div>

      <Panel
        eyebrow="CLIENT INVENTORY"
        title="Search, Filter & Sort"
        rightContent={
          <span className="topology-count">
            {sortedClients.length} results
          </span>
        }
      >
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
              placeholder="Search name, hostname, MAC address or IP address..."
              aria-label="Search wireless clients"
            />

            {search.length > 0 && (
              <button
                type="button"
                className="management-action-button"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>

          <div className="access-point-controls">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }
              aria-label="Filter clients by connectivity status"
            >
              <option value="all">
                All statuses
              </option>

              <option value="connected">
                Connected
              </option>

              <option value="disconnected">
                Disconnected
              </option>

              <option value="unknown">
                Unknown
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
              aria-label="Sort clients"
            >
              <option value="name">
                Sort by name
              </option>

              <option value="mac_address">
                Sort by MAC
              </option>

              <option value="ip_address">
                Sort by IP
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

            {hasActiveFilters && (
              <button
                type="button"
                className="management-action-button"
                onClick={clearFilters}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="client-search-summary">
            {search.trim().length > 0 && (
              <>
                <span>SEARCH</span>

                <strong>
                  "{search}"
                </strong>
              </>
            )}

            {statusFilter !== "all" && (
              <>
                <span>STATUS</span>

                <strong>
                  {statusFilter}
                </strong>
              </>
            )}

            <span>
              {sortedClients.length} matching
              client
              {sortedClients.length === 1
                ? ""
                : "s"}
            </span>
          </div>
        )}

        {sortedClients.length === 0 ? (
          <div className="empty-state">
            <strong>
              {hasActiveFilters
                ? "No matching clients"
                : "No clients found"}
            </strong>

            <span>
              {hasActiveFilters
                ? "Try changing the search or filter criteria."
                : "No wireless clients are currently available."}
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                className="management-action-button"
                onClick={clearFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="client-management-table">
            <div className="client-management-header">
              <button
                type="button"
                onClick={() =>
                  handleSort("name")
                }
              >
                CLIENT
              </button>

              <span>NETWORK</span>

              <button
                type="button"
                onClick={() =>
                  handleSort(
                    "mac_address",
                  )
                }
              >
                MAC ADDRESS
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSort("status")
                }
              >
                STATUS
              </button>

              <span>SIGNAL</span>

              <span>ACTIONS</span>
            </div>

            {sortedClients.map(
              (client) => {
                const connectivity =
                  getConnectivityState(
                    client.status,
                  );

                const connected =
                  connectivity ===
                  "Connected";

                return (
                  <div
                    className="client-management-row client-management-row-actions"
                    key={client.id}
                  >
                    <div className="client-identity">
                      <div className="client-icon">
                        CL
                      </div>

                      <div>
                        <strong>
                          {getClientName(
                            client,
                          )}
                        </strong>

                        <span>
                          {client.hostname ??
                            `Client ID: ${client.id}`}
                        </span>
                      </div>
                    </div>

                    <div className="client-network">
                      <strong>
                        {client.ip_address ??
                          "—"}
                      </strong>

                      <span>
                        Site ID:{" "}
                        {client.site_id}
                      </span>
                    </div>

                    <div className="client-mac">
                      {client.mac_address}
                    </div>

                    <div>
                      <StatusBadge
                        status={
                          connectivity
                        }
                        online={connected}
                      />
                    </div>

                    <div className="client-signal">
                      <strong>
                        {client.rssi !==
                          null &&
                        client.rssi !==
                          undefined
                          ? `${client.rssi} dBm`
                          : "—"}
                      </strong>

                      <span>
                        {client.snr !==
                          null &&
                        client.snr !==
                          undefined
                          ? `SNR ${client.snr} dB`
                          : "Signal unavailable"}
                      </span>
                    </div>

                    <div className="client-actions">
                      <button
                        type="button"
                        className="management-action-button"
                        onClick={() =>
                          setSelectedClient(
                            client,
                          )
                        }
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </Panel>

      {unknownCount > 0 && (
        <div className="api-error-banner">
          <div>
            <strong>
              {unknownCount} client
              {unknownCount === 1
                ? ""
                : "s"} with unknown
              connectivity state
            </strong>

            <span>
              These clients have a backend
              status that is not currently
              classified as connected or
              disconnected.
            </span>
          </div>
        </div>
      )}

      <ClientDetails
        client={selectedClient}
        onClose={() =>
          setSelectedClient(null)
        }
      />

      <SsidSummary
        ssids={ssids}
      />

      <Panel
        eyebrow="WIRELESS NETWORK INVENTORY"
        title="SSIDs"
        rightContent={
          <span className="topology-count">
            {ssids.length} SSIDs
          </span>
        }
      >
        {ssids.length === 0 ? (
          <div className="empty-state">
            <strong>
              No SSIDs found
            </strong>

            <span>
              No wireless networks are
              currently available from the
              network API.
            </span>
          </div>
        ) : (
          <SsidTable
            ssids={ssids}
            onSelect={(ssid) =>
              setSelectedSsid(ssid)
            }
          />
        )}
      </Panel>

      <SsidDetails
        ssid={selectedSsid}
        onClose={() =>
          setSelectedSsid(null)
        }
      />
    </div>
  );
}