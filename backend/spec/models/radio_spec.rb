require "rails_helper"

RSpec.describe Radio, type: :model do
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

  let(:valid_attributes) do
    {
      access_point: access_point,
      band: "5GHz",
      channel: 36,
      status: "online"
    }
  end

  describe "associations" do
    it "belongs to an access point" do
      radio = Radio.new(valid_attributes)

      expect(radio.access_point).to eq(access_point)
    end

    it "has many telemetry records" do
      radio = Radio.create!(valid_attributes)

      telemetry = radio.telemetry_records.create!(
        rssi: -55.0,
        snr: 35.0,
        noise_floor: -90.0,
        channel_utilization: 25.0,
        packet_loss: 1.0,
        latency: 10.0,
        connected_clients: 10,
        traffic_mbps: 100.0
      )

      expect(radio.telemetry_records).to include(telemetry)
    end

    it "destroys associated telemetry records when destroyed" do
      radio = Radio.create!(valid_attributes)

      radio.telemetry_records.create!(
        rssi: -55.0,
        snr: 35.0,
        noise_floor: -90.0,
        channel_utilization: 25.0,
        packet_loss: 1.0,
        latency: 10.0,
        connected_clients: 10,
        traffic_mbps: 100.0
      )

      expect do
        radio.destroy
      end.to change(TelemetryRecord, :count).by(-1)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      radio = Radio.new(valid_attributes)

      expect(radio).to be_valid
    end

    it "requires a band" do
      radio = Radio.new(valid_attributes.merge(band: nil))

      expect(radio).not_to be_valid
      expect(radio.errors[:band]).to include("can't be blank")
    end

    it "requires a channel" do
      radio = Radio.new(valid_attributes.merge(channel: nil))

      expect(radio).not_to be_valid
      expect(radio.errors[:channel]).to include("can't be blank")
    end

    it "requires a status" do
      radio = Radio.new(valid_attributes.merge(status: nil))

      expect(radio).not_to be_valid
      expect(radio.errors[:status]).to include("can't be blank")
    end
  end
end
