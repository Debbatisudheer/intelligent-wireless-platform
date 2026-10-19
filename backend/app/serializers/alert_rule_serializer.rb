class AlertRuleSerializer
  def initialize(alert_rule)
    @alert_rule = alert_rule
  end

  def as_json
    {
      id: @alert_rule.id,
      site_id: @alert_rule.site_id,
      name: @alert_rule.name,
      metric: @alert_rule.metric,
      operator: @alert_rule.operator,
      threshold: @alert_rule.threshold,
      severity: @alert_rule.severity,
      enabled: @alert_rule.enabled,
      created_at: @alert_rule.created_at,
      updated_at: @alert_rule.updated_at
    }
  end
end
