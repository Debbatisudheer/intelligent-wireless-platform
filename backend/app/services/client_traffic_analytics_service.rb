class ClientTrafficAnalyticsService
  def self.analyze(telemetry)
    {
      connected_clients: telemetry.connected_clients,
      traffic_mbps: telemetry.traffic_mbps,
      client_load: client_load(telemetry.connected_clients),
      traffic_health: traffic_health(telemetry.traffic_mbps)
    }
  end

  def self.client_load(connected_clients)
    case connected_clients
    when 0...10
      "low"
    when 10...30
      "normal"
    when 30...50
      "high"
    else
      "critical"
    end
  end

  def self.traffic_health(traffic_mbps)
    case traffic_mbps
    when 0...100
      "low"
    when 100...300
      "normal"
    when 300...500
      "high"
    else
      "very_high"
    end
  end
end
