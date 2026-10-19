import Panel from "../components/Panel";

export default function SsidsPage() {
  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">WIRELESS NETWORK</span>
          <h2>SSIDs</h2>
        </div>
      </header>

      <Panel
        eyebrow="SSID MANAGEMENT"
        title="Wireless Networks"
      >
        <div className="empty-state">
          <strong>SSID Management</strong>
          <span>
            SSID management will be implemented in Phase 22.
          </span>
        </div>
      </Panel>
    </div>
  );
}