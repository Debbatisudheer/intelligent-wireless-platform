class AlertSerializer
  def initialize(alert)
    @alert = alert
  end

  def as_json
    {
      id: @alert.id,
      alert_rule_id: @alert.alert_rule_id,
      site_id: @alert.site_id,
      message: @alert.message,
      severity: @alert.severity,
      status: @alert.status,
      created_at: @alert.created_at,
      updated_at: @alert.updated_at
    }
  end
end
