class ScenarioBuilder
  def initialize
    @current_screen_position = 0
  end

  def create_screen(&block)
    @current_question_position = 0
    @screen = Screen.find_or_initialize_by position: @current_screen_position
    yield
    @screen.save!

    create_screen_template(@screen)

    @current_screen_position += 1
  end

  def template(template)
    @screen.template = template
    @screen.slug = template
  end

  def create_question(&block)
    @question = Question.find_or_initialize_by screen: @screen, position: @current_question_position
    yield
    @question.save!
    @current_question_position +=1
  end

  def type(type)
    @question.type = type
  end

  def points(points)
    @question.points = points
  end

  def right_options(right_options)
    @question.right_options = right_options
  end

  def title(title)
    @question.title = title
  end

  def introduction(introduction)
    @question.introduction = introduction
  end

  def options(*options)
    @question.options = options
  end

  def hint(hint)
    @question.hint = hint
  end

  def scenario(&block)
    instance_eval(&block)
  end

  private

  def create_screen_template(screen)
    full_template_path = Rails.root.join('app', 'views', screen.template_path)
    unless File.file?(full_template_path)
      FileUtils.touch(full_template_path)
    end

    # Generate JS templates
    # full_template_path = Rails.root.join('app', 'assets', 'javascripts', 'screens', File.basename(screen.template_path).split('.').first + '.js')
    # unless File.file?(full_template_path)
    #   FileUtils.touch(full_template_path)
    # end

  end
end
