class Ssid < ApplicationRecord
  belongs_to :site

  validates :name, presence: true
  validates :security_type, presence: true
  validates :status, presence: true
end
