require "rails_helper"

RSpec.describe "Telemetry Analytics API", type: :request do
  describe "GET /api/v1/telemetry_records/:id/analytics" do
    let!(:radio) do
      Radio.create!(
        band: "5GHz",
        channel: 36,
        status: "online",
        access_point: AccessPoint.create!(
          name: "Test-AP-01",
          mac_address: "AA:BB:CC:DD:EE:99",
          ip_address: "192.168.1.99",
          status: "online",
          site: Site.create!(
            name: "Test Site",
            organization: Organization.create!(
              name: "Test Organization"
            )
          )
        )
      )
    end

    let!(:telemetry) do
      TelemetryRecord.create!(
        radio: radio,
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

    it "returns wireless analytics for the telemetry record" do
      get "/api/v1/telemetry_records/#{telemetry.id}/analytics"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body["data"]["signal_quality"]).to eq("excellent")
      expect(body["data"]["snr_quality"]).to eq("excellent")
      expect(body["data"]["channel_health"]).to eq("excellent")
      expect(body["data"]["packet_loss_health"]).to eq("excellent")
      expect(body["data"]["latency_health"]).to eq("excellent")
      expect(body["data"]["overall_health"]).to eq("excellent")
    end
  end
end
