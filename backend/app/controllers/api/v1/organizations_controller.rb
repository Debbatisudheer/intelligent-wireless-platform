module Api
  module V1
    class OrganizationsController < ApplicationController
      def index
        organizations = ApiQueryService.call(
          Organization.all,
          params: params
        )

        render_collection(
          organizations,
          serializer: OrganizationSerializer
        )
      end
    end
  end
end
