module Telemetry
  module Sources
    class SimulatorTelemetrySource < Telemetry::Sources::TelemetrySource
      def fetch
        Telemetry::WirelessTelemetrySimulator.generate
      end
    end
  end
end
