module Api
  module V1
    class RadiosController < ApplicationController
      def index
        radios = ApiQueryService.call(
          Radio.all,
          params: params
        )

        render_collection(
          radios,
          serializer: RadioSerializer
        )
      end
    end
  end
end
