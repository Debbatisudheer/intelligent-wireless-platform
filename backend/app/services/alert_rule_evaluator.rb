class AlertRuleEvaluator
  OPERATORS = %w[> >= < <= ==].freeze

  def self.evaluate(rule:, telemetry:)
    validate_rule!(rule)
    validate_telemetry!(telemetry)

    return false unless rule.enabled

    value = telemetry_value(telemetry, rule.metric)

    return false if value.nil?

    compare(value, rule.operator, rule.threshold)
  end

  def self.telemetry_value(telemetry, metric)
    return nil unless metric.present?
    return nil unless telemetry.respond_to?(metric)

    telemetry.public_send(metric)
  end

  def self.compare(value, operator, threshold)
    case operator
    when ">"
      value > threshold
    when ">="
      value >= threshold
    when "<"
      value < threshold
    when "<="
      value <= threshold
    when "=="
      value == threshold
    else
      false
    end
  end

  def self.validate_rule!(rule)
    return if rule.present?

    raise ArgumentError, "Alert rule is required"
  end

  def self.validate_telemetry!(telemetry)
    return if telemetry.present?

    raise ArgumentError, "Telemetry record is required"
  end

  private_class_method :telemetry_value
  private_class_method :compare
  private_class_method :validate_rule!
  private_class_method :validate_telemetry!
end
