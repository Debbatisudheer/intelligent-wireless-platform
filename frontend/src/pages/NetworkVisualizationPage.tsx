import { useEffect, useMemo, useState } from "react";

import Panel from "../components/Panel";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import NetworkSummary from "../components/visualization/NetworkSummary";
import NetworkFilters from "../components/visualization/NetworkFilters";
import NetworkTopology from "../components/visualization/NetworkTopology";
import NetworkNodeDetails from "../components/visualization/NetworkNodeDetails";

import { getNetworkVisualizationData } from "../services/networkVisualization";

import type {
  NetworkNodeSelection,
  NetworkVisualizationData,
} from "../types/networkVisualization";

export default function NetworkVisualizationPage() {
  const [data, setData] =
    useState<NetworkVisualizationData>({
      sites: [],
      accessPoints: [],
      radios: [],
      clients: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [retrying, setRetrying] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [nodeType, setNodeType] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [selectedNode, setSelectedNode] =
    useState<NetworkNodeSelection | null>(
      null,
    );

  const loadData = async () => {
    try {
      setError(null);

      const result =
        await getNetworkVisualizationData();

      setData(result);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load network visualization data from the backend.",
      );
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredData = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const matchesSearch = (
      values: unknown[],
    ) => {
      if (!normalizedSearch) {
        return true;
      }

      return values
        .filter(
          (value) =>
            value !== null &&
            value !== undefined,
        )
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    };

    const matchesStatus = (
      value: string | undefined,
    ) => {
      if (status === "all") {
        return true;
      }

      return value?.toLowerCase() === status;
    };

    const sites =
      nodeType !== "all" &&
      nodeType !== "site"
        ? data.sites
        : data.sites.filter((site) =>
            matchesSearch([
              site.id,
              site.name,
            ]),
          );

    const accessPoints =
      data.accessPoints.filter(
        (accessPoint) => {
          if (
            nodeType !== "all" &&
            nodeType !== "access-point"
          ) {
            return true;
          }

          return (
            matchesStatus(accessPoint.status) &&
            matchesSearch([
              accessPoint.id,
              accessPoint.name,
              accessPoint.mac_address,
              accessPoint.ip_address,
            ])
          );
        },
      );

    const radios =
      data.radios.filter((radio) => {
        if (
          nodeType !== "all" &&
          nodeType !== "radio"
        ) {
          return true;
        }

        return (
          matchesStatus(radio.status) &&
          matchesSearch([
            radio.id,
            radio.band,
            radio.channel,
          ])
        );
      });

    const clients =
      data.clients.filter((client) => {
        if (
          nodeType !== "all" &&
          nodeType !== "client"
        ) {
          return true;
        }

        return (
          matchesStatus(client.status) &&
          matchesSearch([
            client.id,
            client.name,
            client.hostname,
            client.mac_address,
            client.ip_address,
          ])
        );
      });

    return {
      sites,
      accessPoints,
      radios,
      clients,
    };
  }, [
    data,
    nodeType,
    status,
    search,
  ]);

  const clearFilters = () => {
    setNodeType("all");
    setStatus("all");
    setSearch("");
  };

  const retry = async () => {
    setRetrying(true);
    await loadData();
  };

  if (loading) {
    return (
      <div className="page">
        <LoadingState
          title="Building network topology"
          message="Loading sites, access points, radios, and clients."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            NETWORK INTELLIGENCE
          </span>

          <h2>
            Advanced Network Visualization
          </h2>

          <p>
            Explore the live wireless infrastructure
            hierarchy from sites to connected clients.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={retry}
          disabled={retrying}
        >
          {retrying
            ? "Refreshing..."
            : "Refresh Network"}
        </button>
      </div>

      {error && (
        <ErrorState
          title="Network visualization unavailable"
          message={error}
          onRetry={retry}
          retrying={retrying}
        />
      )}

      <NetworkSummary data={data} />

      <Panel
        eyebrow="TOPOLOGY CONTROL"
        title="Network Explorer"
      >
        <NetworkFilters
          nodeType={nodeType}
          status={status}
          search={search}
          onNodeTypeChange={setNodeType}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
          onClear={clearFilters}
        />

        <NetworkTopology
          data={filteredData}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        />
      </Panel>

      {selectedNode && (
        <NetworkNodeDetails
          data={data}
          selection={selectedNode}
          onClose={() =>
            setSelectedNode(null)
          }
        />
      )}
    </div>
  );
}