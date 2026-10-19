import Panel from "../components/Panel";

export default function RadiosPage() {
  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">WIRELESS NETWORK</span>
          <h2>Radios</h2>
        </div>
      </header>

      <Panel
        eyebrow="RADIO MANAGEMENT"
        title="Wireless Radio Management"
      >
        <div className="empty-state">
          <strong>Radio Management</strong>
          <span>
            Detailed radio management will be implemented
            as the dashboard expands.
          </span>
        </div>
      </Panel>
    </div>
  );
}