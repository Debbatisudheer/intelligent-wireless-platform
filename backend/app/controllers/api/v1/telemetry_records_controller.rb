module Api
  module V1
    class TelemetryRecordsController < ApplicationController
      def index
        telemetry_records = ApiQueryService.call(
          TelemetryRecord.all,
          params: params
        )

        render_collection(
          telemetry_records,
          serializer: TelemetryRecordSerializer
        )
      end

      def analytics
        telemetry = TelemetryRecord.find(params[:id])

        render json: {
          data: WirelessAnalyticsSerializer.new(telemetry).as_json
        }
      end
    end
  end
end
