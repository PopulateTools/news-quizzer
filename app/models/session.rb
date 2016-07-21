require 'obscenity/active_model'

class Session < ApplicationRecord

  has_many :answers

  validates :age, numericality: { only_integer: true, greater_than: 0, less_than: 120 }
  validates :country, inclusion: { in: ISO3166::Country.all.map{|c| c.number.to_i } }
  validates :nickname, uniqueness: true, presence: true, obscenity: { sanitize: true, replacement: :stars }, length: { maximum: 10 }

  scope :completed, -> { where(completed: true) }

  def self.max_points
    @max_points ||= Question.sum(:points) + Question.count * TimePointsAssigment::MAX_POINTS * 2
  end

  def country_object
    ISO3166::Country.find_country_by_number(format('%.3d',self.country))
  end

end
