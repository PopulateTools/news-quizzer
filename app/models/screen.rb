class Screen < ApplicationRecord
  include MemoryRecord

  TEMPLATES_PATH = "screens/game"

  has_many :questions, -> { order(position: :asc) }

  validates :position, uniqueness: true
  validates :slug, uniqueness: true
  validates :template, uniqueness: true

  scope :sorted, -> { order(position: :asc) }

  def self.max_progress_value
    cached_count - 2
  end

  def template_path
    "#{TEMPLATES_PATH}/#{self.template}.html.erb"
  end

  def self.questions_cache
    @questions_cache ||= begin
                           cache = {}
                           Question.all.each do |q|
                             cache[q.screen_id] ||= []
                             cache[q.screen_id].push(q)
                             cache[q.screen_id].sort_by(&:position)
                           end
                           cache
                         end
  end

  def first_question
    self.class.questions_cache[self.id].first
  end

  def find_question(id)
    self.class.questions_cache[self.id].detect{|q| q.id == id.to_i} || raise(ActiveRecord::RecordNotFound.new("Couldn't find Question with 'id'=#{id}"))
  end

  def cached_questions
    self.class.questions_cache[self.id]
  end

end
