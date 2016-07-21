class Slider < Question
  def correct?(answer_options)
    percentage = 0.1
    answer_option = answer_options.first.to_f
    right_option = right_options.first.to_f

    ((right_option - percentage*right_option)..(right_option + percentage*right_option)).include?(answer_option)
  end

  def as_json(options = {})
    {
      question: self.title,
      domain: self.options,
      number_format: number_format,
      values: [
        {
          label: "Your guess",
          value: self.options.first,
          class: "guess"
        }
      ]
    }
  end

  def right_options_check(options = {})
    {
      right_options: [
        {
          label: "Average guess",
          value: average_option,
          class: "average"
        },
        {
          label: "Reality",
          value: self.right_options.first,
          class: "reality"
        }
      ]
    }.merge(options)
  end

  private

  def number_format
    return "r" if options[1] < 100
    "s"
  end

  def average_option
    answers.average("numeric_option").to_f
  end
end
