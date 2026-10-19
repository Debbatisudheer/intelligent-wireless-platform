class Client < ApplicationRecord
  belongs_to :site

  validates :hostname, presence: true
  validates :mac_address, presence: true, uniqueness: true
  validates :ip_address, presence: true
  validates :status, presence: true
end
