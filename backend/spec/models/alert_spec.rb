require "rails_helper"

RSpec.describe Alert, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:site) do
    organization.sites.create!(name: "Test Site")
  end

  let(:alert_rule) do
    AlertRule.create!(
      site: site,
      name: "High Packet Loss",
      metric: "packet_loss",
      operator: ">",
      threshold: 5,
      severity: "high"
    )
  end

  let(:valid_attributes) do
    {
      alert_rule: alert_rule,
      site: site,
      message: "Packet loss exceeded threshold",
      severity: "high",
      status: "open"
    }
  end

  describe "associations" do
    it "belongs to an alert rule" do
      alert = Alert.new(valid_attributes)

      expect(alert.alert_rule).to eq(alert_rule)
    end

    it "belongs to a site" do
      alert = Alert.new(valid_attributes)

      expect(alert.site).to eq(site)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      alert = Alert.new(valid_attributes)

      expect(alert).to be_valid
    end

    it "requires a message" do
      alert = Alert.new(valid_attributes.merge(message: nil))

      expect(alert).not_to be_valid
      expect(alert.errors[:message]).to include("can't be blank")
    end

    it "requires a severity" do
      alert = Alert.new(valid_attributes.merge(severity: nil))

      expect(alert).not_to be_valid
      expect(alert.errors[:severity]).to include("can't be blank")
    end

    it "requires a status" do
      alert = Alert.new(valid_attributes.merge(status: nil))

      expect(alert).not_to be_valid
      expect(alert.errors[:status]).to include("can't be blank")
    end
  end
end
