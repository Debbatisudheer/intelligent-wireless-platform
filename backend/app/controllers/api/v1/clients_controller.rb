module Api
  module V1
    class ClientsController < ApplicationController
      def index
        clients = ApiQueryService.call(
          Client.all,
          params: params
        )

        render_collection(
          clients,
          serializer: ClientSerializer
        )
      end
    end
  end
end
