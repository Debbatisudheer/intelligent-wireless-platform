import SignalAnalytics from "../components/analytics/SignalAnalytics";
import SnrAnalytics from "../components/analytics/SnrAnalytics";
import AnalyticsMetricsDashboard from "../components/analytics/AnalyticsMetricsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            NETWORK ANALYSIS
          </span>

          <h2>Wireless Analytics</h2>

          <p>
            Analyze wireless signal quality,
            network performance, utilization,
            reliability and historical
            telemetry.
          </p>
        </div>
      </div>

      <SignalAnalytics />

      <SnrAnalytics />

      <AnalyticsMetricsDashboard />
    </div>
  );
}