interface AlertFiltersProps {
  search: string;
  severity: string;
  status: string;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export default function AlertFilters({
  search,
  severity,
  status,
  onSearchChange,
  onSeverityChange,
  onStatusChange,
  onClear,
}: AlertFiltersProps) {
  const hasFilters =
    search.trim() !== "" ||
    severity !== "all" ||
    status !== "all";

  return (
    <div className="filter-bar">
      <input
        type="search"
        value={search}
        placeholder="Search alerts..."
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

      <select
        value={severity}
        onChange={(event) =>
          onSeverityChange(event.target.value)
        }
      >
        <option value="all">All Severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
      >
        <option value="all">All Statuses</option>
        <option value="open">Open</option>
        <option value="active">Active</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          className="secondary-button"
          onClick={onClear}
        >
          Clear
        </button>
      )}
    </div>
  );
}