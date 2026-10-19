class AccessPoint < ApplicationRecord
  belongs_to :site

  has_many :radios, dependent: :destroy

  validates :name, presence: true
  validates :mac_address, presence: true, uniqueness: true
  validates :ip_address, presence: true
  validates :status, presence: true
end
