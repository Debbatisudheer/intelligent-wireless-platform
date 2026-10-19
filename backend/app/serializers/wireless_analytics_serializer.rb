class WirelessAnalyticsSerializer
  def initialize(telemetry)
    @telemetry = telemetry
  end

  def as_json
    WirelessAnalyticsService.analyze(@telemetry)
  end
end
