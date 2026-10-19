class Site < ApplicationRecord
  belongs_to :organization

  has_many :access_points, dependent: :destroy
  has_many :ssids, dependent: :destroy
  has_many :clients, dependent: :destroy
  has_many :alert_rules, dependent: :destroy
  has_many :alerts, dependent: :destroy
  has_many :incidents, dependent: :destroy

  validates :name, presence: true
end
