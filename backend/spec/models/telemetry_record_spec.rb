require "rails_helper"

RSpec.describe TelemetryRecord, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:site) do
    organization.sites.create!(name: "Test Site")
  end

  let(:access_point) do
    site.access_points.create!(
      name: "Test Access Point",
      mac_address: "AA:BB:CC:DD:EE:99",
      ip_address: "192.168.1.99",
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

  let(:valid_attributes) do
    {
      radio: radio,
      rssi: -55.0,
      snr: 35.0,
      noise_floor: -90.0,
      channel_utilization: 25.0,
      packet_loss: 1.0,
      latency: 10.0,
      connected_clients: 10,
      traffic_mbps: 100.0
    }
  end

  describe "associations" do
    it "belongs to a radio" do
      telemetry = TelemetryRecord.new(valid_attributes)

      expect(telemetry.radio).to eq(radio)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      telemetry = TelemetryRecord.new(valid_attributes)

      expect(telemetry).to be_valid
    end

    it "requires RSSI" do
      telemetry = TelemetryRecord.new(valid_attributes.merge(rssi: nil))

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:rssi]).to include("can't be blank")
    end

    it "requires SNR" do
      telemetry = TelemetryRecord.new(valid_attributes.merge(snr: nil))

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:snr]).to include("can't be blank")
    end

    it "requires channel utilization between 0 and 100" do
      telemetry = TelemetryRecord.new(
        valid_attributes.merge(channel_utilization: 101)
      )

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:channel_utilization]).not_to be_empty
    end

    it "requires packet loss between 0 and 100" do
      telemetry = TelemetryRecord.new(
        valid_attributes.merge(packet_loss: 101)
      )

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:packet_loss]).not_to be_empty
    end

    it "requires latency to be non-negative" do
      telemetry = TelemetryRecord.new(
        valid_attributes.merge(latency: -1)
      )

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:latency]).not_to be_empty
    end

    it "requires connected clients to be non-negative" do
      telemetry = TelemetryRecord.new(
        valid_attributes.merge(connected_clients: -1)
      )

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:connected_clients]).not_to be_empty
    end

    it "requires traffic to be non-negative" do
      telemetry = TelemetryRecord.new(
        valid_attributes.merge(traffic_mbps: -1)
      )

      expect(telemetry).not_to be_valid
      expect(telemetry.errors[:traffic_mbps]).not_to be_empty
    end
  end
end
