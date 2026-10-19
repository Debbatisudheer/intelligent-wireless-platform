module Api
  module V1
    class IncidentsController < ApplicationController
      def index
        incidents = ApiQueryService.call(
          Incident.all,
          params: params
        )

        render_collection(
          incidents,
          serializer: IncidentSerializer
        )
      end
    end
  end
end
