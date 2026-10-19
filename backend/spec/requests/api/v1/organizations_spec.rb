
require "rails_helper"

RSpec.describe "Api::V1::Organizations", type: :request do
  describe "GET /api/v1/organizations" do
    let!(:organization) { Organization.create!(name: "Test Organization") }

    it "returns organizations successfully" do
      get "/api/v1/organizations"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body["data"].first["id"]).to eq(organization.id)
      expect(body["data"].first["name"]).to eq("Test Organization")
    end

    it "returns an empty data array when no organizations exist" do
      Organization.delete_all

      get "/api/v1/organizations"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body["data"]).to eq([])
    end

    it "returns pagination metadata" do
      get "/api/v1/organizations"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("meta")
    end
  end
end
