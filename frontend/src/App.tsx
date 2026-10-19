import { Routes, Route } from "react-router-dom";

import "./App.css";

import DashboardLayout from "./components/DashboardLayout";

import OverviewPage from "./pages/OverviewPage";
import AccessPointsPage from "./pages/AccessPointsPage";
import RadiosPage from "./pages/RadiosPage";
import ClientsPage from "./pages/ClientsPage";
import SsidsPage from "./pages/SsidsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AlertsPage from "./pages/AlertsPage";
import RealtimeDashboardPage from "./pages/RealtimeDashboardPage";
import NetworkVisualizationPage from "./pages/NetworkVisualizationPage";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route
          path="/"
          element={<OverviewPage />}
        />

        <Route
          path="/access-points"
          element={<AccessPointsPage />}
        />

        <Route
          path="/radios"
          element={<RadiosPage />}
        />

        <Route
          path="/clients"
          element={<ClientsPage />}
        />

        <Route
          path="/ssids"
          element={<SsidsPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="/realtime"
          element={<RealtimeDashboardPage />}
        />

        <Route
          path="/visualization"
          element={<NetworkVisualizationPage />}
        />

        <Route
          path="/alerts"
          element={<AlertsPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;