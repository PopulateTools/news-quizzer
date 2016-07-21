class Answer < ApplicationRecord
  serialize :options, Set

  belongs_to :session
  belongs_to :question

  before_validation :set_default_took, :set_numeric_option
  before_create :complete_attributes_after_answering

  validates :options, length: { minimum: 1 }

  scope :correct, -> { where(correct: true) }

  def self.for_session(session)
    where(session_id: session.id).first
  end

  def points
    if question_points && time_points
      question_points + time_points
    else
      0
    end
  end

  def options=(value)
    value = Set.new if value.length == 1 && value.first.nil?
    super(value)
  end

  def to_json(options = {})
    question.right_options_check(options).to_json
  end

  private

  def complete_attributes_after_answering
    self.correct = question.correct?(self.options)

    if self.correct
      self.question_points = self.question.points
      self.time_points = TimePointsAssigment.new(self.question, self.took).points
    end
  end

  def set_default_took
    self.took ||= 40_000
  end

  def set_numeric_option
    if question.is_a?(Slider)
      self.numeric_option = self.options.first.to_f
    end
  end

end
