class SingleChoiceQuestion < Question
  def right_options_check(options = {})
    {
      right_options: right_options,
      hint: hint
    }.merge(options)
  end
end
