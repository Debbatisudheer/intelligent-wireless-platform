class AlertRule < ApplicationRecord
  belongs_to :site
  has_many :alerts, dependent: :destroy

  validates :name, presence: true
  validates :metric, presence: true
  validates :operator, presence: true
  validates :threshold, presence: true
  validates :severity, presence: true, inclusion: {
    in: %w[low medium high critical]
  }
end
