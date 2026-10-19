module Telemetry
  module Sources
    class FileTelemetrySource < Telemetry::Sources::TelemetrySource
      def initialize(file_path:)
        @file_path = file_path
      end

      def fetch
        JSON.parse(File.read(@file_path), symbolize_names: true)
      end
    end
  end
end
