interface NetworkFiltersProps {
  nodeType: string;
  status: string;
  search: string;
  onNodeTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export default function NetworkFilters({
  nodeType,
  status,
  search,
  onNodeTypeChange,
  onStatusChange,
  onSearchChange,
  onClear,
}: NetworkFiltersProps) {
  const hasFilters =
    nodeType !== "all" ||
    status !== "all" ||
    search.trim() !== "";

  return (
    <div className="filter-bar visualization-filters">
      <input
        type="search"
        value={search}
        placeholder="Search network..."
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

      <select
        value={nodeType}
        onChange={(event) =>
          onNodeTypeChange(event.target.value)
        }
      >
        <option value="all">All Nodes</option>
        <option value="site">Sites</option>
        <option value="access-point">
          Access Points
        </option>
        <option value="radio">Radios</option>
        <option value="client">Clients</option>
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
      >
        <option value="all">All Status</option>
        <option value="online">Online</option>
        <option value="connected">Connected</option>
        <option value="offline">Offline</option>
        <option value="active">Active</option>
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