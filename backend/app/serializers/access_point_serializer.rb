class AccessPointSerializer
  def initialize(access_point)
    @access_point = access_point
  end

  def as_json
    {
      id: @access_point.id,
      site_id: @access_point.site_id,
      name: @access_point.name,
      mac_address: @access_point.mac_address,
      ip_address: @access_point.ip_address,
      status: @access_point.status,
      created_at: @access_point.created_at,
      updated_at: @access_point.updated_at
    }
  end
end
