module Api
  module V1
    class SitesController < ApplicationController
      def index
        sites = ApiQueryService.call(
          Site.all,
          params: params
        )

        render_collection(
          sites,
          serializer: SiteSerializer
        )
      end
    end
  end
end
