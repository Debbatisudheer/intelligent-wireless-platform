class Alert < ApplicationRecord
  belongs_to :alert_rule
  belongs_to :site

  validates :message, presence: true
  validates :severity, presence: true
  validates :status, presence: true
end
