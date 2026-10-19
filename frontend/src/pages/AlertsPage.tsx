import { useEffect, useMemo, useState } from "react";

import Panel from "../components/Panel";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import AlertSummary from "../components/alerts/AlertSummary";
import AlertFilters from "../components/alerts/AlertFilters";
import AlertTable from "../components/alerts/AlertTable";
import AlertDetails from "../components/alerts/AlertDetails";
import IncidentTable from "../components/alerts/IncidentTable";
import IncidentDetails from "../components/alerts/IncidentDetails";

import { api } from "../services/api";

import type { Alert } from "../types/alert";
import type { Incident } from "../types/incident";

interface AlertApiResponse {
  data: Alert[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

interface IncidentApiResponse {
  data: Incident[];
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");

  const [selectedAlert, setSelectedAlert] =
    useState<Alert | null>(null);

  const [selectedIncident, setSelectedIncident] =
    useState<Incident | null>(null);

  const loadData = async () => {
    try {
      setError(null);

      const [alertResponse, incidentResponse] =
        await Promise.all([
          api.getAlerts() as Promise<AlertApiResponse>,
          api.getIncidents() as Promise<IncidentApiResponse>,
        ]);

      setAlerts(alertResponse.data ?? []);
      setIncidents(incidentResponse.data ?? []);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load alerts and incidents from the backend.",
      );
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredAlerts = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return [...alerts]
      .filter((alert) => {
        if (
          severity !== "all" &&
          alert.severity?.toLowerCase() !== severity
        ) {
          return false;
        }

        if (
          status !== "all" &&
          alert.status?.toLowerCase() !== status
        ) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const searchableText = [
          alert.name,
          alert.message,
          alert.metric,
          alert.severity,
          alert.status,
          alert.site_id,
          alert.access_point_id,
          alert.radio_id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch,
        );
      })
      .sort((a, b) => {
        const first = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const second = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

        return second - first;
      });
  }, [alerts, search, severity, status]);

  const clearFilters = () => {
    setSearch("");
    setSeverity("all");
    setStatus("all");
  };

  const retry = async () => {
    setRetrying(true);
    await loadData();
  };

  if (loading) {
    return (
      <div className="page">
        <LoadingState
          title="Loading alert operations"
          message="Retrieving current alerts and incidents."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            NETWORK OPERATIONS
          </span>

          <h2>Alerts & Incidents</h2>

          <p>
            Monitor active wireless network conditions,
            alert severity, and incident state.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={retry}
          disabled={retrying}
        >
          {retrying ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <ErrorState
          title="Alert data unavailable"
          message={error}
          onRetry={retry}
          retrying={retrying}
        />
      )}

      <AlertSummary alerts={alerts} />

      <Panel
        eyebrow="ALERT MANAGEMENT"
        title="Network Alerts"
        rightContent={
          <span className="card-meta">
            {filteredAlerts.length} visible
          </span>
        }
      >
        <AlertFilters
          search={search}
          severity={severity}
          status={status}
          onSearchChange={setSearch}
          onSeverityChange={setSeverity}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />

        <AlertTable
          alerts={filteredAlerts}
          onSelect={setSelectedAlert}
        />
      </Panel>

      <Panel
        eyebrow="INCIDENT OPERATIONS"
        title="Incidents"
        rightContent={
          <span className="card-meta">
            {incidents.length} total
          </span>
        }
      >
        <IncidentTable
          incidents={incidents}
          onSelect={setSelectedIncident}
        />
      </Panel>

      <AlertDetails
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />

      <IncidentDetails
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}