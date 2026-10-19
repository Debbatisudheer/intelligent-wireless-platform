class TelemetryService
  REQUIRED_FIELDS = %i[
    rssi
    snr
    channel_utilization
    packet_loss
    latency
    connected_clients
    traffic_mbps
  ].freeze

  def self.record(radio:, data:)
    validate!(data)

    telemetry = TelemetryRecord.create!(
      radio: radio,
      rssi: data[:rssi],
      snr: data[:snr],
      noise_floor: data[:noise_floor],
      channel_utilization: data[:channel_utilization],
      packet_loss: data[:packet_loss],
      latency: data[:latency],
      connected_clients: data[:connected_clients],
      traffic_mbps: data[:traffic_mbps]
    )

    broadcast(telemetry)

    telemetry
  end

  def self.broadcast(telemetry)
    ActionCable.server.broadcast(
      "telemetry",
      {
        id: telemetry.id,
        radio_id: telemetry.radio_id,
        rssi: telemetry.rssi,
        snr: telemetry.snr,
        noise_floor: telemetry.noise_floor,
        channel_utilization: telemetry.channel_utilization,
        packet_loss: telemetry.packet_loss,
        latency: telemetry.latency,
        connected_clients: telemetry.connected_clients,
        traffic_mbps: telemetry.traffic_mbps,
        created_at: telemetry.created_at
      }
    )
  end

  def self.validate!(data)
    raise ArgumentError, "Telemetry data must be a Hash" unless data.is_a?(Hash)

    REQUIRED_FIELDS.each do |field|
      raise ArgumentError, "#{field.to_s.humanize} is required" if data[field].nil?
    end

    validate_percentage!(
      data[:channel_utilization],
      "Channel utilization"
    )

    validate_percentage!(
      data[:packet_loss],
      "Packet loss"
    )

    validate_non_negative!(
      data[:latency],
      "Latency"
    )

    validate_non_negative!(
      data[:connected_clients],
      "Connected clients"
    )

    validate_non_negative!(
      data[:traffic_mbps],
      "Traffic"
    )
  end

  def self.validate_percentage!(value, field_name)
    unless value.is_a?(Numeric) && value.between?(0, 100)
      raise ArgumentError, "#{field_name} must be between 0 and 100"
    end
  end

  def self.validate_non_negative!(value, field_name)
    unless value.is_a?(Numeric) && value >= 0
      raise ArgumentError, "#{field_name} cannot be negative"
    end
  end

  private_class_method :validate!
  private_class_method :broadcast
  private_class_method :validate_percentage!
  private_class_method :validate_non_negative!
end
