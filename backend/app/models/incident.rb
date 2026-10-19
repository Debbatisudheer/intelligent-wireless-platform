class Incident < ApplicationRecord
  belongs_to :site

  validates :title, presence: true
  validates :severity, presence: true
  validates :status, presence: true
end
