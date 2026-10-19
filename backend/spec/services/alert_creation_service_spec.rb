require "rails_helper"

RSpec.describe AlertCreationService do
  let(:site) do
    Site.create!(
      organization: Organization.create!(name: "Alert Test Organization"),
      name: "Alert Test Site"
    )
  end

  let(:rule) do
    AlertRule.create!(
      site: site,
      name: "High RSSI Threshold",
      metric: "rssi",
      operator: ">",
      threshold: -50,
      severity: "high",
      enabled: true
    )
  end

  let(:telemetry) do
    instance_double(
      TelemetryRecord,
      rssi: -45
    )
  end

  before do
    allow(AlertRuleEvaluator).to receive(:evaluate)
      .and_return(true)
  end

  describe ".create" do
    it "creates an alert when the rule is triggered" do
      expect do
        described_class.create(
          rule: rule,
          telemetry: telemetry
        )
      end.to change(Alert, :count).by(1)
    end

    it "returns the created alert" do
      alert = described_class.create(
        rule: rule,
        telemetry: telemetry
      )

      expect(alert).to be_a(Alert)
      expect(alert).to be_persisted
    end

    it "creates an open alert with the correct attributes" do
      alert = described_class.create(
        rule: rule,
        telemetry: telemetry
      )

      expect(alert.alert_rule).to eq(rule)
      expect(alert.site).to eq(site)
      expect(alert.severity).to eq("high")
      expect(alert.status).to eq("open")
      expect(alert.message).to eq(
        "rssi > -50.0 (actual: -45)"
      )
    end

    it "returns nil when the rule is not triggered" do
      allow(AlertRuleEvaluator).to receive(:evaluate)
        .and_return(false)

      result = described_class.create(
        rule: rule,
        telemetry: telemetry
      )

      expect(result).to be_nil
      expect(Alert.count).to eq(0)
    end

    it "returns the existing open alert instead of creating a duplicate" do
      existing_alert = Alert.create!(
        alert_rule: rule,
        site: site,
        message: "Existing alert",
        severity: "high",
        status: "open"
      )

      expect do
        result = described_class.create(
          rule: rule,
          telemetry: telemetry
        )

        expect(result).to eq(existing_alert)
      end.not_to change(Alert, :count)
    end

    it "creates a new alert when an existing alert is closed" do
      Alert.create!(
        alert_rule: rule,
        site: site,
        message: "Closed alert",
        severity: "high",
        status: "closed"
      )

      expect do
        described_class.create(
          rule: rule,
          telemetry: telemetry
        )
      end.to change(Alert, :count).by(1)
    end

    it "passes the rule and telemetry to AlertRuleEvaluator" do
      described_class.create(
        rule: rule,
        telemetry: telemetry
      )

      expect(AlertRuleEvaluator).to have_received(:evaluate).with(
        rule: rule,
        telemetry: telemetry
      )
    end

    it "raises when the rule is missing" do
      expect do
        described_class.create(
          rule: nil,
          telemetry: telemetry
        )
      end.to raise_error(
        ArgumentError,
        "Alert rule is required"
      )
    end

    it "raises when telemetry is missing" do
      expect do
        described_class.create(
          rule: rule,
          telemetry: nil
        )
      end.to raise_error(
        ArgumentError,
        "Telemetry record is required"
      )
    end
  end

  describe ".build_message" do
    it "builds the alert message from the rule and telemetry" do
      message = described_class.send(
        :build_message,
        rule,
        telemetry
      )

      expect(message).to eq(
        "rssi > -50.0 (actual: -45)"
      )
    end

    it "raises when the metric is missing" do
      invalid_rule = instance_double(
        AlertRule,
        metric: nil
      )

      expect do
        described_class.send(
          :build_message,
          invalid_rule,
          telemetry
        )
      end.to raise_error(
        ArgumentError,
        "Alert metric is required"
      )
    end
  end
end
