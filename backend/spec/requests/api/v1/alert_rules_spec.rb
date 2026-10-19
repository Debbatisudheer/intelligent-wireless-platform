require "rails_helper"

RSpec.describe "Api::V1::AlertRules", type: :request do
  describe "GET /api/v1/alert_rules" do
    it "returns alert rules successfully" do
      get "/api/v1/alert_rules"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body).to include("meta")
    end
  end
end
