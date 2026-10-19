class Radio < ApplicationRecord
  belongs_to :access_point

  has_many :telemetry_records, dependent: :destroy

  validates :band, presence: true
  validates :channel, presence: true
  validates :status, presence: true
end
