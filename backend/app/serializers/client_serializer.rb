class ClientSerializer
  def initialize(client)
    @client = client
  end

  def as_json
    {
      id: @client.id,
      site_id: @client.site_id,
      hostname: @client.hostname,
      mac_address: @client.mac_address,
      ip_address: @client.ip_address,
      status: @client.status,
      created_at: @client.created_at,
      updated_at: @client.updated_at
    }
  end
end
