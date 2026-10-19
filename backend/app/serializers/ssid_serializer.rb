class SsidSerializer
  def initialize(ssid)
    @ssid = ssid
  end

  def as_json
    {
      id: @ssid.id,
      site_id: @ssid.site_id,
      name: @ssid.name,
      security_type: @ssid.security_type,
      status: @ssid.status,
      created_at: @ssid.created_at,
      updated_at: @ssid.updated_at
    }
  end
end
