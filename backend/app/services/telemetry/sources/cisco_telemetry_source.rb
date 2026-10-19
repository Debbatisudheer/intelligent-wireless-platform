module Telemetry
  module Sources
    class CiscoTelemetrySource < Telemetry::Sources::TelemetrySource
      def initialize(client:)
        @client = client
      end

      def fetch
        @client.fetch_telemetry
      end
    end
  end
end
