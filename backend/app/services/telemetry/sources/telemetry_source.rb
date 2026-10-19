module Telemetry
  module Sources
    class TelemetrySource
      def fetch
        raise NotImplementedError, "Telemetry source must implement #fetch"
      end
    end
  end
end
