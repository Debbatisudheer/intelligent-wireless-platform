module Api
  module V1
    class AlertsController < ApplicationController
      def index
        alerts = ApiQueryService.call(
          Alert.all,
          params: params
        )

        render_collection(
          alerts,
          serializer: AlertSerializer
        )
      end
    end
  end
end
