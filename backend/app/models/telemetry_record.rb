class TelemetryRecord < ApplicationRecord
  belongs_to :radio

  validates :rssi, presence: true
  validates :snr, presence: true

  validates :channel_utilization,
            numericality: { in: 0..100 }

  validates :packet_loss,
            numericality: { in: 0..100 }

  validates :latency,
            numericality: { greater_than_or_equal_to: 0 }

  validates :connected_clients,
            numericality: { greater_than_or_equal_to: 0 }

  validates :traffic_mbps,
            numericality: { greater_than_or_equal_to: 0 }
end
