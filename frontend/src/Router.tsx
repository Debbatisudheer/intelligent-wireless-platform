import { Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";

import OverviewPage from "./pages/OverviewPage";
import AccessPointsPage from "./pages/AccessPointsPage";
import ClientsPage from "./pages/ClientsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RealtimeDashboardPage from "./pages/RealtimeDashboardPage";

export default function Router() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<OverviewPage />} />

        <Route
          path="/access-points"
          element={<AccessPointsPage />}
        />

        <Route
          path="/radios"
          element={<OverviewPage />}
        />

        <Route
          path="/clients"
          element={<ClientsPage />}
        />

        <Route
          path="/ssids"
          element={<ClientsPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        {/* Phase 24 */}
        <Route
          path="/realtime"
          element={<RealtimeDashboardPage />}
        />

        <Route
          path="/alerts"
          element={<OverviewPage />}
        />
      </Route>
    </Routes>
  );
}

// $env:PGPASSWORD="686868"; ruby bin\rails server