require "rails_helper"

RSpec.describe "Api::V1::Sites", type: :request do
  describe "GET /api/v1/sites" do
    let!(:organization) { Organization.create!(name: "Test Organization") }
    let!(:site) do
      Site.create!(
        organization: organization,
        name: "Test Site"
      )
    end

    it "returns sites successfully" do
      get "/api/v1/sites"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body["data"].first["id"]).to eq(site.id)
      expect(body["data"].first["name"]).to eq("Test Site")
    end

    it "returns an empty data array when no sites exist" do
      Site.delete_all

      get "/api/v1/sites"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body["data"]).to eq([])
    end

    it "returns pagination metadata" do
      get "/api/v1/sites"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("meta")
    end
  end
end
