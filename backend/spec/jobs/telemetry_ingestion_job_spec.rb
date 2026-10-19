require "rails_helper"

RSpec.describe TelemetryIngestionJob do
  let(:organization) do
    Organization.create!(
      name: "Test Organization"
    )
  end

  let(:site) do
    Site.create!(
      organization: organization,
      name: "Test Site"
    )
  end

  let(:access_point) do
    AccessPoint.create!(
      site: site,
      name: "Test AP",
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

  describe "#perform" do
    it "creates a telemetry record for the radio" do
      expect {
        described_class.perform_now(radio.id)
      }.to change(TelemetryRecord, :count).by(1)

      record = TelemetryRecord.order(created_at: :desc).first

      expect(record.radio_id).to eq(radio.id)
      expect(record.rssi).not_to be_nil
      expect(record.snr).not_to be_nil
    end

    it "uses the simulator telemetry source" do
      expect(Telemetry::Sources::SimulatorTelemetrySource).to receive(:new).and_call_original

      described_class.perform_now(radio.id)
    end

    it "raises RecordNotFound for an invalid radio" do
      expect {
        described_class.perform_now(-999)
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
