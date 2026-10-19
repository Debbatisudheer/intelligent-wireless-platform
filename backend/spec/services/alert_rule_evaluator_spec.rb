require "rails_helper"

RSpec.describe AlertRuleEvaluator do
  describe ".evaluate" do
    let(:telemetry) do
      instance_double(
        TelemetryRecord,
        rssi: -45,
        snr: 35,
        channel_utilization: 25,
        packet_loss: 1.0,
        latency: 10
      )
    end

    it "returns true when a rule condition is met" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: ">",
        threshold: -50
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(true)
    end

    it "returns false when a rule condition is not met" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: "<",
        threshold: -50
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(false)
    end

    it "returns false when the rule is disabled" do
      rule = instance_double(
        AlertRule,
        enabled: false,
        metric: "rssi",
        operator: ">",
        threshold: -50
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(false)
    end

    it "returns false when the metric does not exist" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "unknown_metric",
        operator: ">",
        threshold: 10
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(false)
    end

    it "returns false when the metric value is nil" do
      telemetry_with_nil = instance_double(
        TelemetryRecord,
        rssi: nil
      )

      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: ">",
        threshold: -50
      )

      expect(
        described_class.evaluate(
          rule: rule,
          telemetry: telemetry_with_nil
        )
      ).to be(false)
    end

    it "returns false for an unsupported operator" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: "!=",
        threshold: -50
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(false)
    end

    it "raises when the rule is missing" do
      expect do
        described_class.evaluate(rule: nil, telemetry: telemetry)
      end.to raise_error(ArgumentError, "Alert rule is required")
    end

    it "raises when telemetry is missing" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: ">",
        threshold: -50
      )

      expect do
        described_class.evaluate(rule: rule, telemetry: nil)
      end.to raise_error(ArgumentError, "Telemetry record is required")
    end
  end

  describe "operators" do
    let(:telemetry) do
      instance_double(
        TelemetryRecord,
        rssi: -45
      )
    end

    it "supports greater than" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: ">",
        threshold: -50
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(true)
    end

    it "supports greater than or equal" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: ">=",
        threshold: -45
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(true)
    end

    it "supports less than" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: "<",
        threshold: -40
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(true)
    end

    it "supports less than or equal" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: "<=",
        threshold: -45
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(true)
    end

    it "supports equality" do
      rule = instance_double(
        AlertRule,
        enabled: true,
        metric: "rssi",
        operator: "==",
        threshold: -45
      )

      expect(described_class.evaluate(rule: rule, telemetry: telemetry)).to be(true)
    end
  end
end
