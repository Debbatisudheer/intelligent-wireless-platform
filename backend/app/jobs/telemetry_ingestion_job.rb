class TelemetryIngestionJob < ApplicationJob
  queue_as :default

  def perform(radio_id)
    radio = Radio.find(radio_id)

    source = Telemetry::Sources::SimulatorTelemetrySource.new

    TelemetryIngestionService.ingest(
      radio: radio,
      source: source
    )
  end
end
