class TimePointsAssigment
  MAX_POINTS = 180

  def initialize(question, took)
    @question = question
    # Convert to seconds
    @took = (took.to_f/1_000 - 5).to_i
  end

  def points
    p = (MAX_POINTS - @took)*2
    p = 0 if p < 0
    p
  end
end
