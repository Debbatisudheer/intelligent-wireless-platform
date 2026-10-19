class TelemetryRecordSerializer
  def initialize(telemetry_record)
    @telemetry_record = telemetry_record
  end

  def as_json
    {
      id: @telemetry_record.id,
      radio_id: @telemetry_record.radio_id,
      rssi: @telemetry_record.rssi,
      snr: @telemetry_record.snr,
      noise_floor: @telemetry_record.noise_floor,
      channel_utilization: @telemetry_record.channel_utilization,
      packet_loss: @telemetry_record.packet_loss,
      latency: @telemetry_record.latency,
      connected_clients: @telemetry_record.connected_clients,
      traffic_mbps: @telemetry_record.traffic_mbps,
      created_at: @telemetry_record.created_at,
      updated_at: @telemetry_record.updated_at
    }
  end
end
