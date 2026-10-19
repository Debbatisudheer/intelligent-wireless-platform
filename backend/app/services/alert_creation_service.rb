class AlertCreationService
  def self.create(rule:, telemetry:)
    validate_rule!(rule)
    validate_telemetry!(telemetry)

    triggered = AlertRuleEvaluator.evaluate(
      rule: rule,
      telemetry: telemetry
    )

    return nil unless triggered

    existing_alert = Alert.find_by(
      alert_rule: rule,
      site: rule.site,
      status: "open"
    )

    return existing_alert if existing_alert

    Alert.create!(
      alert_rule: rule,
      site: rule.site,
      message: build_message(rule, telemetry),
      severity: rule.severity,
      status: "open"
    )
  end

  def self.build_message(rule, telemetry)
    validate_metric!(rule.metric)

    value = telemetry.public_send(rule.metric)

    "#{rule.metric} #{rule.operator} #{rule.threshold} (actual: #{value})"
  end

  def self.validate_rule!(rule)
    return if rule.present?

    raise ArgumentError, "Alert rule is required"
  end

  def self.validate_telemetry!(telemetry)
    return if telemetry.present?

    raise ArgumentError, "Telemetry record is required"
  end

  def self.validate_metric!(metric)
    return if metric.present?

    raise ArgumentError, "Alert metric is required"
  end

  private_class_method :build_message
  private_class_method :validate_rule!
  private_class_method :validate_telemetry!
  private_class_method :validate_metric!
end
