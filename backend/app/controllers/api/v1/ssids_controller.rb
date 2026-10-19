module Api
  module V1
    class SsidsController < ApplicationController
      def index
        ssids = ApiQueryService.call(
          Ssid.all,
          params: params
        )

        render_collection(
          ssids,
          serializer: SsidSerializer
        )
      end
    end
  end
end
