require "rails_helper"

RSpec.describe AlertRule, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:site) do
    organization.sites.create!(name: "Test Site")
  end

  let(:valid_attributes) do
    {
      site: site,
      name: "High Packet Loss",
      metric: "packet_loss",
      operator: ">",
      threshold: 5.0,
      severity: "high"
    }
  end

  describe "associations" do
    it "belongs to a site" do
      alert_rule = AlertRule.new(valid_attributes)

      expect(alert_rule.site).to eq(site)
    end

    it "has many alerts" do
      alert_rule = AlertRule.create!(valid_attributes)

      alert = alert_rule.alerts.create!(
        site: site,
        message: "Packet loss exceeded threshold",
        severity: "high",
        status: "open"
      )

      expect(alert_rule.alerts).to include(alert)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      alert_rule = AlertRule.new(valid_attributes)

      expect(alert_rule).to be_valid
    end

    it "requires a name" do
      alert_rule = AlertRule.new(valid_attributes.merge(name: nil))

      expect(alert_rule).not_to be_valid
      expect(alert_rule.errors[:name]).to include("can't be blank")
    end

    it "requires a metric" do
      alert_rule = AlertRule.new(valid_attributes.merge(metric: nil))

      expect(alert_rule).not_to be_valid
      expect(alert_rule.errors[:metric]).to include("can't be blank")
    end

    it "requires an operator" do
      alert_rule = AlertRule.new(valid_attributes.merge(operator: nil))

      expect(alert_rule).not_to be_valid
      expect(alert_rule.errors[:operator]).to include("can't be blank")
    end

    it "requires a threshold" do
      alert_rule = AlertRule.new(valid_attributes.merge(threshold: nil))

      expect(alert_rule).not_to be_valid
      expect(alert_rule.errors[:threshold]).to include("can't be blank")
    end

    it "requires a severity" do
      alert_rule = AlertRule.new(valid_attributes.merge(severity: nil))

      expect(alert_rule).not_to be_valid
      expect(alert_rule.errors[:severity]).to include("can't be blank")
    end

    it "accepts valid severity values" do
      %w[low medium high critical].each do |severity|
        alert_rule = AlertRule.new(valid_attributes.merge(severity: severity))

        expect(alert_rule).to be_valid
      end
    end

    it "rejects invalid severity values" do
      alert_rule = AlertRule.new(
        valid_attributes.merge(severity: "invalid")
      )

      expect(alert_rule).not_to be_valid
      expect(alert_rule.errors[:severity]).to include(
        "is not included in the list"
      )
    end
  end
end
