require "rails_helper"

RSpec.describe "Api::V1::TelemetryRecords", type: :request do
  describe "GET /api/v1/telemetry_records" do
    it "returns telemetry records successfully" do
      get "/api/v1/telemetry_records"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body).to include("meta")
    end
  end

  describe "GET /api/v1/telemetry_records/:id/analytics" do
    let!(:organization) do
      Organization.create!(name: "Analytics Organization")
    end

    let!(:site) do
      Site.create!(
        organization: organization,
        name: "Analytics Site"
      )
    end

    let!(:access_point) do
      AccessPoint.create!(
        site: site,
        name: "Analytics AP",
        mac_address: "AA:BB:CC:DD:EE:99",
        ip_address: "192.168.1.99",
        status: "online"
      )
    end

    let!(:radio) do
      Radio.create!(
        access_point: access_point,
        band: "5GHz",
        channel: 36,
        status: "online"
      )
    end

    let!(:telemetry) do
      TelemetryRecord.create!(
        radio: radio,
        rssi: -45,
        snr: 35,
        noise_floor: -95,
        channel_utilization: 20,
        packet_loss: 0.5,
        latency: 8,
        connected_clients: 10,
        traffic_mbps: 100
      )
    end

    it "returns wireless analytics successfully" do
      get "/api/v1/telemetry_records/#{telemetry.id}/analytics"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_a(Hash)
    end

    it "returns not found for an unknown telemetry record" do
      get "/api/v1/telemetry_records/999999/analytics"

      expect(response).to have_http_status(:not_found)

      body = JSON.parse(response.body)

      expect(body["error"]["code"]).to eq("NOT_FOUND")
    end
  end
end
