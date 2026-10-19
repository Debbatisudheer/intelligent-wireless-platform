require "rails_helper"

RSpec.describe WirelessAnalyticsService do
  describe ".analyze" do
    let(:telemetry) do
      instance_double(
        TelemetryRecord,
        rssi: -45,
        snr: 35,
        channel_utilization: 20,
        packet_loss: 0.5,
        latency: 5
      )
    end

    it "returns analytics for telemetry" do
      result = described_class.analyze(telemetry)

      expect(result).to include(
        signal_quality: "excellent",
        snr_quality: "excellent",
        channel_health: "excellent",
        packet_loss_health: "excellent",
        latency_health: "excellent",
        overall_health: "excellent"
      )
    end

    it "rejects missing telemetry" do
      expect do
        described_class.analyze(nil)
      end.to raise_error(ArgumentError, "Telemetry record is required")
    end
  end

  describe ".signal_quality" do
    it "classifies excellent signal" do
      expect(described_class.signal_quality(-50)).to eq("excellent")
    end

    it "classifies good signal" do
      expect(described_class.signal_quality(-55)).to eq("good")
    end

    it "classifies fair signal" do
      expect(described_class.signal_quality(-65)).to eq("fair")
    end

    it "classifies poor signal" do
      expect(described_class.signal_quality(-75)).to eq("poor")
    end
  end

  describe ".snr_quality" do
    it "classifies excellent SNR" do
      expect(described_class.snr_quality(30)).to eq("excellent")
    end

    it "classifies good SNR" do
      expect(described_class.snr_quality(25)).to eq("good")
    end

    it "classifies fair SNR" do
      expect(described_class.snr_quality(15)).to eq("fair")
    end

    it "classifies poor SNR" do
      expect(described_class.snr_quality(5)).to eq("poor")
    end
  end

  describe ".channel_health" do
    it "classifies excellent channel utilization" do
      expect(described_class.channel_health(20)).to eq("excellent")
    end

    it "classifies good channel utilization" do
      expect(described_class.channel_health(40)).to eq("good")
    end

    it "classifies warning channel utilization" do
      expect(described_class.channel_health(70)).to eq("warning")
    end

    it "classifies critical channel utilization" do
      expect(described_class.channel_health(90)).to eq("critical")
    end
  end

  describe ".packet_loss_health" do
    it "classifies excellent packet loss" do
      expect(described_class.packet_loss_health(0.5)).to eq("excellent")
    end

    it "classifies good packet loss" do
      expect(described_class.packet_loss_health(2)).to eq("good")
    end

    it "classifies warning packet loss" do
      expect(described_class.packet_loss_health(4)).to eq("warning")
    end

    it "classifies critical packet loss" do
      expect(described_class.packet_loss_health(6)).to eq("critical")
    end
  end

  describe ".latency_health" do
    it "classifies excellent latency" do
      expect(described_class.latency_health(5)).to eq("excellent")
    end

    it "classifies good latency" do
      expect(described_class.latency_health(20)).to eq("good")
    end

    it "classifies warning latency" do
      expect(described_class.latency_health(40)).to eq("warning")
    end

    it "classifies critical latency" do
      expect(described_class.latency_health(60)).to eq("critical")
    end
  end

  describe ".overall_health" do
    it "returns excellent for healthy telemetry" do
      telemetry = instance_double(
        TelemetryRecord,
        rssi: -45,
        snr: 35,
        channel_utilization: 20,
        packet_loss: 0.5,
        latency: 5
      )

      expect(described_class.overall_health(telemetry)).to eq("excellent")
    end

    it "returns critical for poor telemetry" do
      telemetry = instance_double(
        TelemetryRecord,
        rssi: -80,
        snr: 5,
        channel_utilization: 90,
        packet_loss: 8,
        latency: 70
      )

      expect(described_class.overall_health(telemetry)).to eq("critical")
    end
  end
end
