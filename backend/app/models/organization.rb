class Organization < ApplicationRecord
  has_many :sites, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
