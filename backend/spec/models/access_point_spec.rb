require "rails_helper"

RSpec.describe AccessPoint, type: :model do
  let(:site) do
    Organization.create!(name: "Test Organization")
      .sites.create!(name: "Test Site")
  end

  let(:valid_attributes) do
    {
      site: site,
      name: "Test Access Point",
      mac_address: "AA:BB:CC:DD:EE:99",
      ip_address: "192.168.1.99",
      status: "online"
    }
  end

  describe "associations" do
    it "belongs to a site" do
      access_point = AccessPoint.new(valid_attributes)

      expect(access_point.site).to eq(site)
    end

    it "has many radios" do
      access_point = AccessPoint.create!(valid_attributes)

      radio = access_point.radios.create!(
        band: "5GHz",
        channel: 36,
        status: "online"
      )

      expect(access_point.radios).to include(radio)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      access_point = AccessPoint.new(valid_attributes)

      expect(access_point).to be_valid
    end

    it "requires a name" do
      access_point = AccessPoint.new(valid_attributes.merge(name: nil))

      expect(access_point).not_to be_valid
      expect(access_point.errors[:name]).to include("can't be blank")
    end

    it "requires a MAC address" do
      access_point = AccessPoint.new(valid_attributes.merge(mac_address: nil))

      expect(access_point).not_to be_valid
      expect(access_point.errors[:mac_address]).to include("can't be blank")
    end

    it "requires a unique MAC address" do
      AccessPoint.create!(valid_attributes)

      duplicate = AccessPoint.new(
        valid_attributes.merge(ip_address: "192.168.1.100")
      )

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:mac_address]).to include("has already been taken")
    end

    it "requires an IP address" do
      access_point = AccessPoint.new(valid_attributes.merge(ip_address: nil))

      expect(access_point).not_to be_valid
      expect(access_point.errors[:ip_address]).to include("can't be blank")
    end

    it "requires a status" do
      access_point = AccessPoint.new(valid_attributes.merge(status: nil))

      expect(access_point).not_to be_valid
      expect(access_point.errors[:status]).to include("can't be blank")
    end
  end
end
