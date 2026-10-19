require "rails_helper"

RSpec.describe Client, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:site) do
    organization.sites.create!(name: "Test Site")
  end

  let(:valid_attributes) do
    {
      site: site,
      hostname: "test-client",
      mac_address: "AA:BB:CC:DD:EE:99",
      ip_address: "192.168.1.99",
      status: "online"
    }
  end

  describe "associations" do
    it "belongs to a site" do
      client = Client.new(valid_attributes)

      expect(client.site).to eq(site)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      client = Client.new(valid_attributes)

      expect(client).to be_valid
    end

    it "requires a hostname" do
      client = Client.new(valid_attributes.merge(hostname: nil))

      expect(client).not_to be_valid
      expect(client.errors[:hostname]).to include("can't be blank")
    end

    it "requires a MAC address" do
      client = Client.new(valid_attributes.merge(mac_address: nil))

      expect(client).not_to be_valid
      expect(client.errors[:mac_address]).to include("can't be blank")
    end

    it "requires a unique MAC address" do
      Client.create!(valid_attributes)

      duplicate = Client.new(
        valid_attributes.merge(
          hostname: "another-client",
          ip_address: "192.168.1.100"
        )
      )

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:mac_address]).to include("has already been taken")
    end

    it "requires an IP address" do
      client = Client.new(valid_attributes.merge(ip_address: nil))

      expect(client).not_to be_valid
      expect(client.errors[:ip_address]).to include("can't be blank")
    end

    it "requires a status" do
      client = Client.new(valid_attributes.merge(status: nil))

      expect(client).not_to be_valid
      expect(client.errors[:status]).to include("can't be blank")
    end
  end
end
