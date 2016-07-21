class Question < ApplicationRecord

  serialize :options, Array
  serialize :right_options, Set

  has_many :answers
  belongs_to :screen, counter_cache: true

  validates :position, uniqueness: {scope: :screen_id}

  scope :sorted, ->{ order("screen_id DESC,position DESC") }
  scope :sorted_asc, ->{ order("screen_id ASC,position DESC") }

  def correct?(answer_options)
    if answer_options.first =~ /\A\d+\z/
      right_options.first.to_i == answer_options.first.to_i
    else
      right_options == answer_options
    end
  end

  def right_options=(value)
    if value.is_a?(Array)
      super(value.to_set)
    else
      super(Set.new([value]))
    end
  end

  def self.last
    @last ||= sorted.first
  end

  def last?
    Question.last == self
  end
end
