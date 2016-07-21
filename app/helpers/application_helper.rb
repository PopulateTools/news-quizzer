module ApplicationHelper
  def countries_for_select
    options_for_select(countries_collection)
  end

  def countries_collection
    @countries_collection ||= ISO3166::Country.all.sort_by{|c| c.name.parameterize }.map{ |c| [c.name, c.number] }
  end

  def different_countries
    Session.select(:country).distinct.length
  end

  def average_age
    Session.average("age").to_i
  end

  def top_players
    Session.completed.order(points: :desc).limit(10)
  end

  def top_countries
    data = Session.completed.select("sessions.country, count(*) as sessions_count").group("country").order("sessions_count DESC").limit(15)
    total = data.sum{|r| r.sessions_count }
    data.map do |r|
      [r.country, ((r.sessions_count.to_f * 100) / total.to_f).ceil ]
    end
  end

  def top_ages
    data = Session.completed.select("sessions.age, count(*) as sessions_count").group("age").order("age ASC")
    total = data.sum{|r| r.sessions_count }
    data.map do |r|
      [r.age, r.sessions_count]
    end.in_groups_of(10).map do |age_info|
      age_info.compact!
      next if age_info.first.nil? || age_info.last.nil?
      sum = age_info.map{|k| k.last}.sum
      ["#{age_info.first.first} - #{age_info.last.first}", ((sum.to_f * 100) / total.to_f).ceil]
    end.compact
  end

  def percentage_correct_answers(question)
    number_to_percentage((question.answers.correct.count * 100) / question.answers.count, precision: 0)
  end

  def duration_in_seconds(milliseconds)
    if milliseconds.present?
      number_with_precision(milliseconds / 1_000, precision: 1, strip_insignificant_zeros: true) + " s"
    end
  end

  def in_game?
    controller_name != 'pages'
  end

end
