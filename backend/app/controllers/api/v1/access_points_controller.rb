module Api
  module V1
    class AccessPointsController < ApplicationController
      def index
        access_points = ApiQueryService.call(
          AccessPoint.all,
          params: params
        )

        render_collection(
          access_points,
          serializer: AccessPointSerializer
        )
      end
    end
  end
end
