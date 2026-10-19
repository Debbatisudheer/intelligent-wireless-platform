class IncidentSerializer
  def initialize(incident)
    @incident = incident
  end

  def as_json
    {
      id: @incident.id,
      site_id: @incident.site_id,
      title: @incident.title,
      description: @incident.description,
      severity: @incident.severity,
      status: @incident.status,
      created_at: @incident.created_at,
      updated_at: @incident.updated_at
    }
  end
end
