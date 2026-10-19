class WirelessAnalyticsService
  SIGNAL_THRESHOLDS = {
    excellent: -50,
    good: -60,
    fair: -70
  }.freeze

  SNR_THRESHOLDS = {
    excellent: 30,
    good: 20,
    fair: 10
  }.freeze

  CHANNEL_THRESHOLDS = {
    excellent: 30,
    good: 60,
    warning: 80
  }.freeze

  PACKET_LOSS_THRESHOLDS = {
    excellent: 1,
    good: 3,
    warning: 5
  }.freeze

  LATENCY_THRESHOLDS = {
    excellent: 10,
    good: 30,
    warning: 50
  }.freeze

  def self.analyze(telemetry)
    validate_telemetry!(telemetry)

    {
      signal_quality: signal_quality(telemetry.rssi),
      snr_quality: snr_quality(telemetry.snr),
      channel_health: channel_health(telemetry.channel_utilization),
      packet_loss_health: packet_loss_health(telemetry.packet_loss),
      latency_health: latency_health(telemetry.latency),
      overall_health: overall_health(telemetry)
    }
  end

  def self.signal_quality(rssi)
    case rssi
    when SIGNAL_THRESHOLDS[:excellent]..0
      "excellent"
    when SIGNAL_THRESHOLDS[:good]...SIGNAL_THRESHOLDS[:excellent]
      "good"
    when SIGNAL_THRESHOLDS[:fair]...SIGNAL_THRESHOLDS[:good]
      "fair"
    else
      "poor"
    end
  end

  def self.snr_quality(snr)
    case snr
    when 30..100
      "excellent"
    when 20...30
      "good"
    when 10...20
      "fair"
    else
      "poor"
    end
  end

  def self.channel_health(utilization)
    case utilization
    when 0...CHANNEL_THRESHOLDS[:excellent]
      "excellent"
    when CHANNEL_THRESHOLDS[:excellent]...CHANNEL_THRESHOLDS[:good]
      "good"
    when CHANNEL_THRESHOLDS[:good]...CHANNEL_THRESHOLDS[:warning]
      "warning"
    else
      "critical"
    end
  end

  def self.packet_loss_health(packet_loss)
    case packet_loss
    when 0...PACKET_LOSS_THRESHOLDS[:excellent]
      "excellent"
    when PACKET_LOSS_THRESHOLDS[:excellent]...PACKET_LOSS_THRESHOLDS[:good]
      "good"
    when PACKET_LOSS_THRESHOLDS[:good]...PACKET_LOSS_THRESHOLDS[:warning]
      "warning"
    else
      "critical"
    end
  end

  def self.latency_health(latency)
    case latency
    when 0...LATENCY_THRESHOLDS[:excellent]
      "excellent"
    when LATENCY_THRESHOLDS[:excellent]...LATENCY_THRESHOLDS[:good]
      "good"
    when LATENCY_THRESHOLDS[:good]...LATENCY_THRESHOLDS[:warning]
      "warning"
    else
      "critical"
    end
  end

  def self.overall_health(telemetry)
    scores = [
      signal_score(telemetry.rssi),
      snr_score(telemetry.snr),
      channel_score(telemetry.channel_utilization),
      packet_loss_score(telemetry.packet_loss),
      latency_score(telemetry.latency)
    ]

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

  def self.signal_score(rssi)
    case rssi
    when -50..0 then 100
    when -60...-50 then 85
    when -70...-60 then 65
    else 35
    end
  end

  def self.snr_score(snr)
    case snr
    when 30..100 then 100
    when 20...30 then 85
    when 10...20 then 65
    else 35
    end
  end

  def self.channel_score(utilization)
    case utilization
    when 0...30 then 100
    when 30...60 then 85
    when 60...80 then 60
    else 30
    end
  end

  def self.packet_loss_score(packet_loss)
    case packet_loss
    when 0...1 then 100
    when 1...3 then 85
    when 3...5 then 60
    else 30
    end
  end

  def self.latency_score(latency)
    case latency
    when 0...10 then 100
    when 10...30 then 85
    when 30...50 then 60
    else 30
    end
  end

  def self.validate_telemetry!(telemetry)
    return if telemetry.respond_to?(:rssi) &&
              telemetry.respond_to?(:snr) &&
              telemetry.respond_to?(:channel_utilization) &&
              telemetry.respond_to?(:packet_loss) &&
              telemetry.respond_to?(:latency)

    raise ArgumentError, "Telemetry record is required"
  end

  private_class_method :validate_telemetry!
  private_class_method :signal_score
  private_class_method :snr_score
  private_class_method :channel_score
  private_class_method :packet_loss_score
  private_class_method :latency_score
end
