class TelemetryIngestionService
  def self.ingest(radio:, source:)
    validate_radio!(radio)
    validate_source!(source)

    data = source.fetch

    TelemetryService.record(
      radio: radio,
      data: data
    )
  end

  def self.validate_radio!(radio)
    return if radio.present?

    raise ArgumentError, "Radio is required"
  end

  def self.validate_source!(source)
    return if source.respond_to?(:fetch)

    raise ArgumentError, "Telemetry source must implement #fetch"
  end

  private_class_method :validate_radio!
  private_class_method :validate_source!
end
