module Api
  module V1
    class AlertRulesController < ApplicationController
      def index
        alert_rules = ApiQueryService.call(
          AlertRule.all,
          params: params
        )

        render_collection(
          alert_rules,
          serializer: AlertRuleSerializer
        )
      end
    end
  end
end
