require "rails_helper"

RSpec.describe Incident, type: :model do
  let(:organization) do
    Organization.create!(name: "Test Organization")
  end

  let(:site) do
    organization.sites.create!(name: "Test Site")
  end

  let(:valid_attributes) do
    {
      site: site,
      title: "High Packet Loss Incident",
      severity: "high",
      status: "open"
    }
  end

  describe "associations" do
    it "belongs to a site" do
      incident = Incident.new(valid_attributes)

      expect(incident.site).to eq(site)
    end
  end

  describe "validations" do
    it "is valid with all required attributes" do
      incident = Incident.new(valid_attributes)

      expect(incident).to be_valid
    end

    it "requires a title" do
      incident = Incident.new(valid_attributes.merge(title: nil))

      expect(incident).not_to be_valid
      expect(incident.errors[:title]).to include("can't be blank")
    end

    it "requires a severity" do
      incident = Incident.new(valid_attributes.merge(severity: nil))

      expect(incident).not_to be_valid
      expect(incident.errors[:severity]).to include("can't be blank")
    end

    it "requires a status" do
      incident = Incident.new(valid_attributes.merge(status: nil))

      expect(incident).not_to be_valid
      expect(incident.errors[:status]).to include("can't be blank")
    end
  end
end
