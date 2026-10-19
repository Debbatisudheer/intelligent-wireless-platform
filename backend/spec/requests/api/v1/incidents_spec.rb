require "rails_helper"

RSpec.describe "Api::V1::Incidents", type: :request do
  describe "GET /api/v1/incidents" do
    it "returns incidents successfully" do
      get "/api/v1/incidents"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body).to include("meta")
    end
  end
end
