class RadioSerializer
  def initialize(radio)
    @radio = radio
  end

  def as_json
    {
      id: @radio.id,
      access_point_id: @radio.access_point_id,
      band: @radio.band,
      channel: @radio.channel,
      status: @radio.status,
      created_at: @radio.created_at,
      updated_at: @radio.updated_at
    }
  end
end
