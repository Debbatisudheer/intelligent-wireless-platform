class AccessPointHealthService
  def self.analyze(access_point)
    telemetry_records = TelemetryRecord
      .joins(radio: :access_point)
      .where(radios: { access_point_id: access_point.id })
      .order(created_at: :desc)

    return {
      access_point_id: access_point.id,
      access_point_name: access_point.name,
      overall_health: "unknown",
      total_records: 0,
      health_distribution: {}
    } if telemetry_records.empty?

    results = telemetry_records.map do |telemetry|
      WirelessAnalyticsService.analyze(telemetry)
    end

    distribution = results
      .map { |result| result[:overall_health] }
      .tally

    {
      access_point_id: access_point.id,
      access_point_name: access_point.name,
      overall_health: calculate_overall_health(results),
      total_records: results.length,
      health_distribution: distribution
    }
  end

  def self.calculate_overall_health(results)
    scores = results.map do |result|
      case result[:overall_health]
      when "excellent" then 100
      when "good" then 85
      when "warning" then 60
      else 30
      end
    end

    average = scores.sum.to_f / scores.length

    case average
    when 90..100
      "excellent"
    when 75...90
      "good"
    when 50...75
      "warning"
    else
      "critical"
    end
  end

  private_class_method :calculate_overall_health
end
