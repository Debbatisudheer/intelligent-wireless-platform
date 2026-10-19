module Telemetry
  class WirelessTelemetrySimulator
    def self.generate
      {
        rssi: rand(-75.0..-40.0).round(1),
        snr: rand(20.0..45.0).round(1),
        noise_floor: rand(-95.0..-80.0).round(1),
        channel_utilization: rand(5.0..85.0).round(1),
        packet_loss: rand(0.0..5.0).round(2),
        latency: rand(2.0..40.0).round(1),
        connected_clients: rand(1..50),
        traffic_mbps: rand(10.0..500.0).round(1)
      }
    end
  end
end
