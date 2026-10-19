require "rails_helper"

RSpec.describe Ssid, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:site) do
    organization.sites.create!(name: "Test Site")
  end

  let(:valid_attributes) do
    {
      site: site,
      name: "Corporate-WiFi",
      security_type: "WPA3",
      status: "active"
    }
  end

  describe "associations" do
    it "belongs to a site" do
      ssid = Ssid.new(valid_attributes)

      expect(ssid.site).to eq(site)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      ssid = Ssid.new(valid_attributes)

      expect(ssid).to be_valid
    end

    it "requires a name" do
      ssid = Ssid.new(valid_attributes.merge(name: nil))

      expect(ssid).not_to be_valid
      expect(ssid.errors[:name]).to include("can't be blank")
    end

    it "requires a security type" do
      ssid = Ssid.new(valid_attributes.merge(security_type: nil))

      expect(ssid).not_to be_valid
      expect(ssid.errors[:security_type]).to include("can't be blank")
    end

    it "requires a status" do
      ssid = Ssid.new(valid_attributes.merge(status: nil))

      expect(ssid).not_to be_valid
      expect(ssid.errors[:status]).to include("can't be blank")
    end
  end
end
