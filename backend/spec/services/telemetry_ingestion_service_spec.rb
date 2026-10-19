require "rails_helper"

RSpec.describe TelemetryIngestionService do
  let(:site) do
    Organization.create!(name: "Ingestion Test Organization")
      .sites.create!(name: "Ingestion Test Site")
  end

  let(:access_point) do
    site.access_points.create!(
      name: "Ingestion Test AP",
      mac_address: "AA:BB:CC:DD:EE:20",
      ip_address: "192.168.20.10",
      status: "online"
    )
  end

  let(:radio) do
    access_point.radios.create!(
      band: "5GHz",
      channel: 36,
      status: "online"
    )
  end

  let(:telemetry_data) do
    {
      rssi: -52.0,
      snr: 35.0,
      noise_floor: -91.0,
      channel_utilization: 30.0,
      packet_loss: 1.0,
      latency: 10.0,
      connected_clients: 20,
      traffic_mbps: 150.0
    }
  end

  let(:source) do
    instance_double(
      "TelemetrySource",
      fetch: telemetry_data
    )
  end

  describe ".ingest" do
    it "fetches telemetry from the source" do
      expect(source).to receive(:fetch).once.and_return(telemetry_data)

      described_class.ingest(
        radio: radio,
        source: source
      )
    end

    it "passes fetched telemetry to TelemetryService" do
      allow(source).to receive(:fetch).and_return(telemetry_data)

      expect(TelemetryService).to receive(:record).with(
        radio: radio,
        data: telemetry_data
      )

      described_class.ingest(
        radio: radio,
        source: source
      )
    end

    it "returns the result from TelemetryService" do
      telemetry = instance_double(TelemetryRecord)

      allow(source).to receive(:fetch).and_return(telemetry_data)
      allow(TelemetryService).to receive(:record).and_return(telemetry)

      result = described_class.ingest(
        radio: radio,
        source: source
      )

      expect(result).to eq(telemetry)
    end

    it "persists telemetry through TelemetryService" do
      expect {
        described_class.ingest(
          radio: radio,
          source: source
        )
      }.to change(TelemetryRecord, :count).by(1)
    end
  end

  describe "validation" do
    it "rejects a missing radio" do
      expect {
        described_class.ingest(
          radio: nil,
          source: source
        )
      }.to raise_error(
        ArgumentError,
        "Radio is required"
      )
    end

    it "rejects a source without fetch" do
      invalid_source = Object.new

      expect {
        described_class.ingest(
          radio: radio,
          source: invalid_source
        )
      }.to raise_error(
        ArgumentError,
        "Telemetry source must implement #fetch"
      )
    end

    it "allows any source that implements fetch" do
      custom_source = Class.new do
        def fetch
          {
            rssi: -60.0,
            snr: 30.0,
            noise_floor: -90.0,
            channel_utilization: 20.0,
            packet_loss: 0.5,
            latency: 8.0,
            connected_clients: 10,
            traffic_mbps: 100.0
          }
        end
      end.new

      expect {
        described_class.ingest(
          radio: radio,
          source: custom_source
        )
      }.to change(TelemetryRecord, :count).by(1)
    end
  end

  describe "error propagation" do
    it "propagates source errors" do
      failing_source = instance_double(
        "TelemetrySource"
      )

      allow(failing_source).to receive(:fetch)
        .and_raise(StandardError, "Telemetry source unavailable")

      expect {
        described_class.ingest(
          radio: radio,
          source: failing_source
        )
      }.to raise_error(
        StandardError,
        "Telemetry source unavailable"
      )
    end

    it "propagates TelemetryService errors" do
      allow(source).to receive(:fetch).and_return(telemetry_data)

      allow(TelemetryService).to receive(:record)
        .and_raise(ArgumentError, "Invalid telemetry")

      expect {
        described_class.ingest(
          radio: radio,
          source: source
        )
      }.to raise_error(
        ArgumentError,
        "Invalid telemetry"
      )
    end
  end
end
