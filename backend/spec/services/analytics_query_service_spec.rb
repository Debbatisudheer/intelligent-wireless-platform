require "rails_helper"

RSpec.describe AnalyticsQueryService do
  let(:organization) do
    Organization.create!(name: "Analytics Test Organization")
  end

  let(:site) do
    Site.create!(
      organization: organization,
      name: "Analytics Test Site"
    )
  end

  let(:access_point) do
    AccessPoint.create!(
      site: site,
      name: "Analytics AP",
      mac_address: "AA:BB:CC:DD:EE:99",
      ip_address: "192.168.1.99",
      status: "online"
    )
  end

  let(:radio) do
    Radio.create!(
      access_point: access_point,
      band: "5GHz",
      channel: 36,
      status: "online"
    )
  end

  before do
    TelemetryRecord.create!(
      radio: radio,
      rssi: -45,
      snr: 35,
      noise_floor: -90,
      channel_utilization: 20,
      packet_loss: 0.5,
      latency: 5,
      connected_clients: 10,
      traffic_mbps: 100
    )

    TelemetryRecord.create!(
      radio: radio,
      rssi: -60,
      snr: 25,
      noise_floor: -88,
      channel_utilization: 40,
      packet_loss: 2,
      latency: 20,
      connected_clients: 20,
      traffic_mbps: 200
    )
  end

  describe ".telemetry_for" do
    it "returns telemetry for the requested radio" do
      result = described_class.telemetry_for(radio: radio)

      expect(result).to contain_exactly(
        *TelemetryRecord.where(radio: radio)
      )
    end

    it "orders telemetry by newest first" do
      result = described_class.telemetry_for(radio: radio)

      expect(result.map(&:created_at)).to eq(
        result.map(&:created_at).sort.reverse
      )
    end

    it "filters telemetry using the from time" do
      from = 1.minute.from_now

      result = described_class.telemetry_for(
        radio: radio,
        from: from
      )

      expect(result).to be_empty
    end

    it "filters telemetry using the to time" do
      to = 1.minute.ago

      result = described_class.telemetry_for(
        radio: radio,
        to: to
      )

      expect(result).to be_empty
    end

    it "filters telemetry using both from and to" do
      from = 1.minute.ago
      to = 1.minute.from_now

      result = described_class.telemetry_for(
        radio: radio,
        from: from,
        to: to
      )

      expect(result.count).to eq(2)
    end

    it "raises when the radio is missing" do
      expect do
        described_class.telemetry_for(radio: nil)
      end.to raise_error(
        ArgumentError,
        "Radio is required"
      )
    end

    it "raises when from is after to" do
      from = 2.hours.from_now
      to = 1.hour.from_now

      expect do
        described_class.telemetry_for(
          radio: radio,
          from: from,
          to: to
        )
      end.to raise_error(
        ArgumentError,
        "From time cannot be after to time"
      )
    end

    it "allows only a from time" do
      result = described_class.telemetry_for(
        radio: radio,
        from: 1.hour.ago
      )

      expect(result.count).to eq(2)
    end

    it "allows only a to time" do
      result = described_class.telemetry_for(
        radio: radio,
        to: 1.hour.from_now
      )

      expect(result.count).to eq(2)
    end
  end
end
