require "rails_helper"

RSpec.describe Site, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:valid_attributes) do
    {
      organization: organization,
      name: "Test Site"
    }
  end

  describe "associations" do
    it "belongs to an organization" do
      site = Site.new(valid_attributes)

      expect(site.organization).to eq(organization)
    end

    it "has many access points" do
      site = Site.create!(valid_attributes)

      access_point = site.access_points.create!(
        name: "Test AP",
        mac_address: "AA:BB:CC:DD:EE:99",
        ip_address: "192.168.1.99",
        status: "online"
      )

      expect(site.access_points).to include(access_point)
    end

    it "has many SSIDs" do
      site = Site.create!(valid_attributes)

      ssid = site.ssids.create!(
        name: "Test-WiFi",
        security_type: "WPA3",
        status: "active"
      )

      expect(site.ssids).to include(ssid)
    end

    it "has many clients" do
      site = Site.create!(valid_attributes)

      client = site.clients.create!(
        hostname: "test-client",
        mac_address: "AA:BB:CC:DD:EE:98",
        ip_address: "192.168.1.98",
        status: "online"
      )

      expect(site.clients).to include(client)
    end

    it "has many alert rules" do
      site = Site.create!(valid_attributes)

      alert_rule = site.alert_rules.create!(
        name: "High Packet Loss",
        metric: "packet_loss",
        operator: ">",
        threshold: 5.0,
        severity: "high"
      )

      expect(site.alert_rules).to include(alert_rule)
    end

    it "has many alerts" do
      site = Site.create!(valid_attributes)

      alert_rule = site.alert_rules.create!(
        name: "High Packet Loss",
        metric: "packet_loss",
        operator: ">",
        threshold: 5.0,
        severity: "high"
      )

      alert = site.alerts.create!(
        alert_rule: alert_rule,
        message: "Packet loss exceeded threshold",
        severity: "high",
        status: "open"
      )

      expect(site.alerts).to include(alert)
    end

    it "has many incidents" do
      site = Site.create!(valid_attributes)

      incident = site.incidents.create!(
        title: "Wireless Network Incident",
        severity: "high",
        status: "open"
      )

      expect(site.incidents).to include(incident)
    end

    it "destroys associated records when destroyed" do
      site = Site.create!(valid_attributes)

      site.access_points.create!(
        name: "Test AP",
        mac_address: "AA:BB:CC:DD:EE:97",
        ip_address: "192.168.1.97",
        status: "online"
      )

      site.ssids.create!(
        name: "Test-WiFi",
        security_type: "WPA3",
        status: "active"
      )

      site.clients.create!(
        hostname: "test-client",
        mac_address: "AA:BB:CC:DD:EE:96",
        ip_address: "192.168.1.96",
        status: "online"
      )

      site.alert_rules.create!(
        name: "High Packet Loss",
        metric: "packet_loss",
        operator: ">",
        threshold: 5.0,
        severity: "high"
      )

      site.incidents.create!(
        title: "Test Incident",
        severity: "high",
        status: "open"
      )

      expect { site.destroy }.to change(AccessPoint, :count).by(-1)
        .and change(Ssid, :count).by(-1)
        .and change(Client, :count).by(-1)
        .and change(AlertRule, :count).by(-1)
        .and change(Incident, :count).by(-1)
    end
  end

  describe "validations" do
    it "is valid with a name" do
      site = Site.new(valid_attributes)

      expect(site).to be_valid
    end

    it "requires a name" do
      site = Site.new(valid_attributes.merge(name: nil))

      expect(site).not_to be_valid
      expect(site.errors[:name]).to include("can't be blank")
    end
  end
end
