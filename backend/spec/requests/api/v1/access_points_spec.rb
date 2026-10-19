require "rails_helper"

RSpec.describe "Api::V1::AccessPoints", type: :request do
  describe "GET /api/v1/access_points" do
    it "returns access points successfully" do
      get "/api/v1/access_points"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      expect(body).to include("data")
      expect(body["data"]).to be_an(Array)
      expect(body).to include("meta")
    end
  end
end
