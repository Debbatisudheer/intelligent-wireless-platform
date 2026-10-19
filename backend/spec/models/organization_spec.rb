require "rails_helper"

RSpec.describe Organization, type: :model do
  let(:valid_attributes) do
    {
      name: "Test Organization"
    }
  end

  describe "associations" do
    it "has many sites" do
      organization = Organization.create!(valid_attributes)

      site = organization.sites.create!(
        name: "Test Site"
      )

      expect(organization.sites).to include(site)
    end

    it "destroys associated sites when destroyed" do
      organization = Organization.create!(valid_attributes)

      organization.sites.create!(
        name: "Test Site"
      )

      expect do
        organization.destroy
      end.to change(Site, :count).by(-1)
    end
  end

  describe "validations" do
    it "is valid with a name" do
      organization = Organization.new(valid_attributes)

      expect(organization).to be_valid
    end

    it "requires a name" do
      organization = Organization.new(name: nil)

      expect(organization).not_to be_valid
      expect(organization.errors[:name]).to include("can't be blank")
    end

    it "requires a unique name" do
      Organization.create!(valid_attributes)

      duplicate = Organization.new(valid_attributes)

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:name]).to include("has already been taken")
    end
  end
end
