require "rails_helper"

RSpec.describe "Api::V1::Alerts", type: :request do
  describe "GET /api/v1/alerts" do
    it "returns alerts successfully" do
      get "/api/v1/alerts"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body).to include("meta")
    end
  end
end
