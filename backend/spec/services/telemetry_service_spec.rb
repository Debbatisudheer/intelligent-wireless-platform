require "rails_helper"

RSpec.describe TelemetryService do
  let(:site) do
    Organization.create!(name: "Telemetry Test Organization")
      .sites.create!(name: "Telemetry Test Site")
  end

  let(:access_point) do
    site.access_points.create!(
      name: "Telemetry Test AP",
      mac_address: "AA:BB:CC:DD:EE:10",
      ip_address: "192.168.10.10",
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

  let(:valid_data) do
    {
      rssi: -55.0,
      snr: 32.0,
      noise_floor: -90.0,
      channel_utilization: 40.0,
      packet_loss: 1.5,
      latency: 12.0,
      connected_clients: 15,
      traffic_mbps: 125.5
    }
  end

  describe ".record" do
    it "creates a telemetry record" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data
        )
      }.to change(TelemetryRecord, :count).by(1)
    end

    it "returns the created telemetry record" do
      telemetry = described_class.record(
        radio: radio,
        data: valid_data
      )

      expect(telemetry).to be_a(TelemetryRecord)
      expect(telemetry.radio).to eq(radio)
    end

    it "persists all telemetry values" do
      telemetry = described_class.record(
        radio: radio,
        data: valid_data
      )

      expect(telemetry.rssi).to eq(-55.0)
      expect(telemetry.snr).to eq(32.0)
      expect(telemetry.noise_floor).to eq(-90.0)
      expect(telemetry.channel_utilization).to eq(40.0)
      expect(telemetry.packet_loss).to eq(1.5)
      expect(telemetry.latency).to eq(12.0)
      expect(telemetry.connected_clients).to eq(15)
      expect(telemetry.traffic_mbps).to eq(125.5)
    end
  end

  describe "validation" do
    it "rejects non-hash telemetry data" do
      expect {
        described_class.record(
          radio: radio,
          data: nil
        )
      }.to raise_error(
        ArgumentError,
        "Telemetry data must be a Hash"
      )
    end

    it "rejects missing RSSI" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(rssi: nil)
        )
      }.to raise_error(ArgumentError, "Rssi is required")
    end

    it "rejects missing SNR" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(snr: nil)
        )
      }.to raise_error(ArgumentError, "Snr is required")
    end

    it "rejects channel utilization below zero" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(channel_utilization: -1)
        )
      }.to raise_error(
        ArgumentError,
        "Channel utilization must be between 0 and 100"
      )
    end

    it "rejects channel utilization above 100" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(channel_utilization: 101)
        )
      }.to raise_error(
        ArgumentError,
        "Channel utilization must be between 0 and 100"
      )
    end

    it "rejects packet loss outside the valid range" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(packet_loss: 101)
        )
      }.to raise_error(
        ArgumentError,
        "Packet loss must be between 0 and 100"
      )
    end

    it "rejects negative latency" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(latency: -1)
        )
      }.to raise_error(
        ArgumentError,
        "Latency cannot be negative"
      )
    end

    it "rejects negative connected clients" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(connected_clients: -1)
        )
      }.to raise_error(
        ArgumentError,
        "Connected clients cannot be negative"
      )
    end

    it "rejects negative traffic" do
      expect {
        described_class.record(
          radio: radio,
          data: valid_data.merge(traffic_mbps: -1)
        )
      }.to raise_error(
        ArgumentError,
        "Traffic cannot be negative"
      )
    end
  end

  describe "broadcasting" do
    it "broadcasts the created telemetry" do
      allow(ActionCable.server).to receive(:broadcast)

      telemetry = described_class.record(
        radio: radio,
        data: valid_data
      )

      expect(ActionCable.server).to have_received(:broadcast).with(
        "telemetry",
        hash_including(
          id: telemetry.id,
          radio_id: radio.id,
          rssi: telemetry.rssi,
          snr: telemetry.snr
        )
      )
    end
  end
end
