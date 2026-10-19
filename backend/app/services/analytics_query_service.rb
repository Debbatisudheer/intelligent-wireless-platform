class AnalyticsQueryService
  def self.telemetry_for(radio:, from: nil, to: nil)
    validate_radio!(radio)
    validate_time_range!(from, to)

    scope = TelemetryRecord.where(radio_id: radio.id)

    scope = scope.where("created_at >= ?", from) if from.present?
    scope = scope.where("created_at <= ?", to) if to.present?

    scope.order(created_at: :desc)
  end

  def self.validate_radio!(radio)
    return if radio.present?

    raise ArgumentError, "Radio is required"
  end

  def self.validate_time_range!(from, to)
    return if from.blank? || to.blank?
    return if from <= to

    raise ArgumentError, "From time cannot be after to time"
  end

  private_class_method :validate_radio!
  private_class_method :validate_time_range!
end
