import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    path: "/",
  },
  {
    label: "Access Points",
    path: "/access-points",
  },
  {
    label: "Radios",
    path: "/radios",
  },
  {
    label: "Clients",
    path: "/clients",
  },
  {
    label: "SSIDs",
    path: "/ssids",
  },
  {
    label: "Analytics",
    path: "/analytics",
  },
  {
    label: "Real-Time",
    path: "/realtime",
  },
  {
    label: "Visualization",
    path: "/visualization",
  },
  {
    label: "Alerts",
    path: "/alerts",
  },
];

export default function DashboardLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            WN
          </div>

          <div>
            <h1>WirelessOps</h1>
            <span>
              Network Management
            </span>
          </div>
        </div>

        <nav className="navigation">
          <div className="nav-section">
            MONITORING
          </div>

          {navigation.slice(0, 5).map(
            (item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive(item.path)
                    ? "active"
                    : ""
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ),
          )}

          <div className="nav-section">
            ANALYSIS
          </div>

          {navigation.slice(5).map(
            (item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive(item.path)
                    ? "active"
                    : ""
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ),
          )}
        </nav>

        <div className="sidebar-footer">
          <span className="system-label">
            SYSTEM
          </span>

          <div className="system-status">
            <span className="status-dot online" />
            Realtime connected
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}