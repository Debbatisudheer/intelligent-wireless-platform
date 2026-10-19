require "rails_helper"

RSpec.describe WirelessAnalyticsService do
  describe ".analyze" do
    let(:telemetry) do
      TelemetryRecord.new(
        rssi: -48.5,
        snr: 42,
        noise_floor: -91,
        channel_utilization: 18.5,
        packet_loss: 0.2,
        latency: 5.5,
        connected_clients: 22,
        traffic_mbps: 210.4
      )
    end

    it "calculates wireless health metrics" do
      result = described_class.analyze(telemetry)

      expect(result[:signal_quality]).to eq("excellent")
      expect(result[:snr_quality]).to eq("excellent")
      expect(result[:channel_health]).to eq("excellent")
      expect(result[:packet_loss_health]).to eq("excellent")
      expect(result[:latency_health]).to eq("excellent")
      expect(result[:overall_health]).to eq("excellent")
    end
  end
end
